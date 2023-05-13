const fs = require('fs');
const http = require('http');




var requests = require('requests');

const mainFile = fs.readFileSync('./main.html','utf-8');

const replaceVal = (tempVal, orgVal)=> {
    let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp -273.15).toFixed(2));
    temperature = temperature.replace("{%temp_min%}",(orgVal.main.temp_min-273.15).toFixed(2));
    temperature = temperature.replace("{%temp_max%}",(orgVal.main.temp_max-273.15).toFixed(2));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);

    return temperature;
};   

http.createServer((req,res)=>{

    if(req.url == "/"){
        requests(
            `http://api.openweathermap.org/data/2.5/weather?q=Jalaun,In&APPID=b97d45f5d894e2544e69405da646018e`
        )
        .on("data",(chunk) => {
            const obj_data = JSON.parse(chunk);
            const arr_data = [obj_data];
           // console.log(arr_data[0].main.temp);
            const realTimeData = arr_data.map((val)=> replaceVal(mainFile,val));
             res.write(realTimeData.join(''));
             console.log(realTimeData.join(""));
            res.end();
        })
        .on("end",(err)=> {
            if (err) return console.log("connection closed due to errors",err);
            res.end();
        })
       } else {res.end("File not found");}
}).listen(8000);
