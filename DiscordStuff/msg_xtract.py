import re
import pandas as pd

msgs = open('disc_msgdata.txt',encoding='utf-8')

#run through messages and concat into list between lines where it says 'PM' (e.g. separating sets of posts by who sent them, brain mode)

with msgs as file_in:
    lines = []
    t_lines = {}
    pmc = 0 
    c_msg = []
    for line in file_in:
        if 'PM' in line or 'AM' in line:
            c_msg = []
            pmc +=1
        c_msg.append(line) #msg to list
        t_lines[pmc]= c_msg #dict for ordering

regex_name = re.compile(r'.+?(?= —)',re.I)
regex_twitter = re.compile(r'(?<=(?i)\btwitter.com\b)[a-zA-z0-9_/].*(?=[\n\r\s])')
regex_tz = re.compile(r'tz([a-km-zA-HJ-NP-Z1-9]{34})')

to_pd = {} #pandas dict
count = 0
#scrape, order, rexex
for msg_group in t_lines.items():
    print('')
    print('')
    _name = ''
    _twitter = ''
    _fxhash = ''
    _tz = ''
    for msg in msg_group[1]: ##sorry this is a mess
        if regex_name.findall(msg):
            _name = regex_name.findall(msg)[0]
            print('_name',regex_name.findall(msg)[0])
        if regex_twitter.findall(msg):
            _twitter = regex_twitter.findall(msg)[0]
            print('_twitter',regex_twitter.findall(msg)[0])
        if regex_tz.findall(msg):
            _tz = 'tz'+str(regex_tz.findall(msg)[0])
            print('_tz  ','tz'+str(regex_tz.findall(msg)[0]))
    to_pd[count]=[_name,_twitter,_tz]
    print(count,[_name,_twitter,_tz])
    count+=1
    
#pandas
df = pd.DataFrame.from_dict(to_pd, orient='index')
df.to_csv('fromDiscord.csv', sep=',')
