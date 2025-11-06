

const UserPassword = ()=>{
    let password = "";
    const string  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!%&";
    let n= string.length;
    for(let i=0;i<8;i++){
        let idx = Math.floor(Math.random() * n);
        password += string[idx];
    }
    return password;
}
module.exports = {UserPassword}