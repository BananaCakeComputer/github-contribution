import requests, http.server, os, json
from bs4 import BeautifulSoup
monthTr = {'January': "一月", 'February': "二月", 'March': "三月", 'April': "四月", 'May': "五月", 'June': "六月", 'July': "七月", 'August': "八月", 'September': "九月", 'October': "十月", 'November': "十一月", 'December': "十二月"}
def searchparam(path):
    res = {}
    if '?' in path:
        key = ''
        content = ''
        processingkey = True
        for i in path[path.index('?') + 1:]:
            if(i == '='):
                processingkey = False
            elif(i == '&'):
                processingkey = True
                res[key] = content
                key = ''
                content = ''
            elif(processingkey):
                key += i
            else:
                content += i
        if(key != ''):
            res[key] = content
    return res
def getRelativePath(path):
    if('?' in path and '#' in path):
        return min(path[0: path.index('?')], path[0: path.index('#')])
    if('?' in path):
        return path[0: path.index('?')]
    if('#' in path):
        return path[0: path.index('#')]
    return path
class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.relpath = getRelativePath(self.path)
        if self.relpath == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(bytes(open('index.html').read(), 'utf-8'))
        elif self.relpath == '/get':
            self.param = searchparam(self.path)
            if('username' in self.param and self.param['username'] != ''):
                res = requests.get('https://github.com/' + self.param['username'] + '?action=show&controller=profiles&tab=contributions&user_id=' + self.param['username'], headers={'x-requested-with': 'XMLHttpRequest'})
                if(res.status_code == 200):
                    if('from' in self.param):
                        years = []
                        y = int(self.param['until'])
                        while y >= int(self.param['from']):
                            years.append(type('obj', (object,), {'text': str(y)}))
                            y -= 1
                    else:
                        years = BeautifulSoup(res.content, 'html.parser').find_all('a', attrs={'class': 'js-year-link'})
                    data = []
                    for i in years:
                        block = []
                        cache = requests.get('https://github.com/users/' + self.param['username'] + '/contributions?to=' + i.text + '-12-31')
                        if(cache.status_code != 200):
                            self.send_response(503)
                            self.send_header('Content-type', 'application/json')
                            self.end_headers()
                            self.wfile.write('内部错误'.encode())
                            return
                        cache = BeautifulSoup(cache.content, 'html.parser')
                        j = -1
                        while j != 0:
                            temp = []
                            if j == -1:
                                j = 1
                            elif j == 6:
                                j = 0
                            else:
                                j += 1
                            k = 0
                            month = []
                            while k < 53:
                                if j == 0 and k == 0:
                                    if cache.find('tool-tip', attrs={'for': 'contribution-day-component-0-0'}) != None:
                                        for l in block:
                                            if l[0] == '一月':
                                                l.insert(0, '一月')
                                            else:
                                                l.insert(0, -1)
                                        if cache.find('tool-tip', attrs={'for': 'contribution-day-component-0-0'}).text.split(' ')[0] == 'No':
                                            temp.append(0)
                                        else:
                                            temp.append(int(cache.find('tool-tip', attrs={'for': 'contribution-day-component-0-0'}).text.split(' ')[0]))
                                elif cache.find('tool-tip', attrs={'for': 'contribution-day-component-' + str(j) + '-' + str(k)}) == None:
                                    temp.append(-1)
                                else:
                                    if j == 1:
                                        month.append(monthTr[cache.find('tool-tip', attrs={'for': 'contribution-day-component-' + str(j) + '-' + str(k)}).text.split(' ')[3]])
                                    if cache.find('tool-tip', attrs={'for': 'contribution-day-component-' + str(j) + '-' + str(k)}).text.split(' ')[0] == 'No':
                                        temp.append(0)
                                    else:
                                        temp.append(int(cache.find('tool-tip', attrs={'for': 'contribution-day-component-' + str(j) + '-' + str(k)}).text.split(' ')[0]))
                                k += 1
                            if j == 1:
                                block.insert(0, month)
                            elif j == 0:
                                temp.append(-1)
                            block.append(temp)
                        data.append(block)
                    userdetails = requests.get('https://github.com/' + self.param['username'])
                    if(userdetails.status_code == 200):
                        userdetails = BeautifulSoup(userdetails.content, 'html.parser')
                        detailsdata = [userdetails.find('span', attrs={'class', 'p-name'}).text, userdetails.find('span', attrs={'class', 'p-nickname'}).text, userdetails.find('img')['src'], int(i.text)]
                        for i in userdetails.find_all('li', attrs={'class': 'vcard-detail'}):
                            detailsdata.append(i.text)
                        data.insert(0, detailsdata)
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps(data).encode())
                    else:
                        self.send_response(503)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write('内部错误'.encode())
                else:
                    self.send_response(422)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write('用户不存在'.encode())
            else:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write('username参数不合法'.encode())
        else:
            if(os.path.exists(self.relpath[1:])):
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(open(self.relpath[1:]).read(), 'utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
if __name__ == '__main__':
    server = http.server.HTTPServer(('', 8080), Handler)
    server.serve_forever()