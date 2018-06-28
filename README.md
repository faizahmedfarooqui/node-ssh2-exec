# node-ssh2-exec
A Node Plugin for SSH2 Login &amp; Exec

# How to make it work?

1. cd node-ssh2-exec/
2. npm install

# How it works?

```
#
# Run command "node shell.js" inside the app folder & provide the necessary details required 
# to login into the server. Username & hostname are required fields.
#
> node shell.js

Deployment Engine Node Plugin for SSH2.

Usage: /usr/local/bin/node shell.js --options...

Options:
  -u, --username, --user       SSH Login Username
  -h, --hostname, --host       SSH Login Hostname
  -n, --portno, --port         SSH Login Port Number                                         [default: 22]
  -p, --password, --secret     SSH Login Password
  -k, --passphrase, --ssh-key  SSH Key / Passphrase for Login {String type: Base64 Encoded}
  -c, --command, --exec        SSH Commands to be Executed {Array type: Base64 Encoded}
  --username                                                                                 [required]
  --hostname                                                                                 [required]

Missing required arguments: username, hostname
```
<details>
 <summary><strong><em>Note for SSH-Key Passphrase</em></strong></summary>

If you have SSH enabled into your server & you want to provide the passphrase into the plugin argument then please Base64 encode your passphrase.
</details>
