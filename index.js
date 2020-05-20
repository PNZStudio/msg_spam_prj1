var colors = require('colors');
const login = require("facebook-chat-api");
const readline = require("readline");
const express = require('express');
const open = require('open');
const fs = require("fs");
const app = express()
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

app.get('/', (req, res) => {
    res.send('<h1>[ อ่านก่อนใช้งานนะครับ ] <br>สำหรับการใช้งานครั้งแรกให้เลือกเมนู Login Facebook Account ก่อนนะครับ ครั้งต่อไปไม่ต้อง Login นะครับ Login แค่ครั้งแรกครั้งเดียว ถ้าหากจะเปลี่ยนบัญชีก็ Login ทับได้เลยครับ <br><span style="color: red ;">สำคัญ! ถ้าไม่อยากเฟสบินให้เปิด Login 2FA นะครับ ต้องเปิดเท่านั้น !<span></h1>')
})
app.listen(1142, () => {
})
    

function title(){
    var title = "\n███████╗██████╗     ███████╗██████╗  █████╗ ███╗   ███╗    ███╗   ███╗███████╗ ██████╗\n██╔════╝██╔══██╗    ██╔════╝██╔══██╗██╔══██╗████╗ ████║    ████╗ ████║██╔════╝██╔════╝\n█████╗  ██████╔╝    ███████╗██████╔╝███████║██╔████╔██║    ██╔████╔██║███████╗██║  ███╗\n██╔══╝  ██╔══██╗    ╚════██║██╔═══╝ ██╔══██║██║╚██╔╝██║    ██║╚██╔╝██║╚════██║██║   ██║\n██║     ██████╔╝    ███████║██║     ██║  ██║██║ ╚═╝ ██║    ██║ ╚═╝ ██║███████║╚██████╔╝\n╚═╝     ╚═════╝     ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝     ╚═╝╚══════╝ ╚═════╝";
    console.clear();
    console.log(colors.red(title));
    console.log("\n========================================================================================= \nPrizNik Dev [x] DedSec Cyber Project 01")

}
function main_menu(type){
    console.log("\n============ MAIN MENU ============ \n\n["+colors.green('01')+"] Login Facebook Account \n["+colors.green('02')+"] Spam Facebook Message \n\n["+colors.blue('00')+"] Readme before use this sctipt..\n["+colors.red('99')+"] EXIT.\n");
}
function re_menu(){
    menu();
}
function re_login(){
    login_fb();
}
function menu(){
    rl.question("MENU > ", function(select) {
        rl.stdoutMuted = false;
        if(select == "01" || select == "1"){
            console.log("\n["+colors.green('11')+"] BACK TO MENU");
            console.log("["+colors.red('99')+"] EXIT\n");
            login_fb();
        }else if(select == "02" || select == "2"){
            spams();
        }else if(select == "00" || select == "0"){
            console.log("["+colors.blue('SYSTEM')+"] Opening Browser...");
            open('http://localhost:1142');
            re_menu();
        }else if(select == "99"){
            console.log("["+colors.blue('SYSTEM')+"] God bye :)");
            process.exit();
        }else{
            console.log("["+colors.red('ERROR')+"] There are no selections in the menu. Please try again.");
            re_menu();
        }
    });
}
function re_spam(){
    spams();
}
function spams(){
    title();
    login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
        if(err) return console.error(err);
        
        rl.question("Target name > ", function(name) {
            rl.question("Msg > ", function(msg) {
                rl.question("amount > ", function(amt) {
                    api.getUserID(name, (err, data) => {
                        if(err) return console.error(err);
                        var threadID = data[0].userID;
                        for (let index = 0; index < amt; index++) {
                            setTimeout(() => {  api.sendMessage(msg, threadID); }, 1000);
                        }
                        console.log("["+colors.blue('SYSTEM')+"] Done.");
                        re_spam();
                    });
                
                });
            });
        });

    });
    
}
function login_fb(){
    rl.question("EMAIL/PHONE NUMBER > ", function(email) {
        if(email == "99"){
            console.log("["+colors.blue('SYSTEM')+"] God bye :)");
            process.exit();
        }else if(email == "11"){
            re_menu();
        }else{
            rl.question("PASSWORD > ", function(password) {
                console.log("");
                const obj = {email: email, password: password};
                login(obj, (err, api) => {
                    if(err) {
                        switch (err.error) {
                            case 'login-approval':
                                console.log('CODE > ');
                                rl.on('line', (line) => {
                                    err.continue(line);
                                    rl.close();
                                });
                                break;
                            default:
                                re_login();
                        }
                        return;
                    }
                    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
                    main();
                });
            
            });
    
        }    
    });
    
}

function main(){
    title();
    main_menu();
    menu();
}


main();