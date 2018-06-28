var encodedKey, decodedKey, encodedCommand, decodedCommand, parsedCommand, shellCommand = [];

var Base64 = require('./base64.js');
var SSH2Shell = require ('ssh2shell');
var fs = require('fs');

var argv = require('optimist')
    .usage('\nDeployment Engine Node Plugin for SSH2.\n\nUsage: /usr/local/bin/node shell.js --options...')
    .demand(['username', 'hostname']);

argv = argv
    .options('u', {
        alias: ['username', 'user'],
        describe: 'SSH Login Username'
    });

argv = argv
    .options('h', {
        alias: ['hostname', 'host'],
        describe: 'SSH Login Hostname'
    });

argv = argv
    .options('n', {
        alias: ['portno', 'port'],
        describe: 'SSH Login Port Number',
        default: 22
    });

argv = argv
    .options('p', {
        alias: ['password', 'secret'],
        describe: 'SSH Login Password'
    });

argv = argv
    .options('k', {
        alias: ['passphrase', 'ssh-key'],
        describe: 'SSH Key / Passphrase for Login {String type: Base64 Encoded}'
    });

argv = argv
    .options('c', {
        alias: ['command', 'exec'],
        describe: 'SSH Commands to be Executed {Array type: Base64 Encoded}'
    });

argv = argv.argv;

// Checks if any of the authentication is provided
if ( argv.k == undefined && argv.p == undefined ) {
    console.log('\nDeployment Engine Node Plugin for SSH2.\n\nUsage: deploy --options...');
    console.log("Missing either arguements: p, k");
    return;
}

encodedCommand = argv.command;
decodedCommand = Base64.decode(encodedCommand);
parsedCommand = JSON.parse(decodedCommand);

for (var i = 0; i < parsedCommand.length; i++) {
    shellCommand[i] = parsedCommand[i];
}

// Host configuration with connection settings and commands
var host = {
    server: {     
        host:         argv.host,
        userName:     argv.user,
        port:         argv.port
    },
    commands: shellCommand,
    idleTimeOut: 360000,                            // in milliseconds (6 minutes)

    asciiFilter: "[^\r\n\x20-\x7e]",                // removes non-standard ASCII output text
    disableColorFilter: false,                      // turns colour filtering on and off output text
    textColorFilter: "(\[{1}[0-9;]+m{1})",          // removes colour formatting codes output text
    
    verbose: false,                                 // outputs all received content
    debug: false,                                   // outputs information about each process step

    connectedMessage: "Connected",
    readyMessage: "Ready",
    closedMessage: "Closed",

    standardPrompt: ">$%#",
    passwordPrompt: ":",
    passphrasePrompt: ":",

    streamEncoding: "utf8",

    // Optional: Enter key character to send as end of line. 
    enter: "\n"                                     // Linux = "\n" | "\x0a\, Mac = "\r" | "x0d"  
};

// If private key is not defined then use password auth method or else use private key auth method
if (argv.k == undefined) {
    host.server.password = argv.secret;
} else  {
    encodedKey = argv.passphrase; 
    decodedKey = Base64.decode(encodedKey);
    host.server.privateKey = decodedKey;
}
    
// Create a new instance passing in the host object
SSH = new SSH2Shell(host);

// Use a callback function to process the full session text
callback = function(sessionText) {
    console.log(sessionText)
};

// Start the process
SSH.connect(callback);