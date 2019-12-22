const express = require("express");
const app = new express();

const DB = require("./module/DB");
const db = new DB("travel");

//全局中间件：post 请求数据解析
const body_parser = require("body-parser");
app.use(body_parser.urlencoded({ extended: false }));

//全局中间件：session 会话
const session = require("express-session");
app.use(session({
    secret: 'travel',
    resave: false,
    saveUninitialized: true
}));

app.listen(8800);

//配置模板引擎 
app.set("view engine", "ejs");

//设置静态资源托管
app.use(express.static("static"));
app.use("/res", express.static("static"));


//【前端路由】--------------------------------------------------------

require("./module/website").init(app, db);

//【后台路由】--------------------------------------------------------

//登录页
require("./module/login").init(app, db);

//注册页
require("./module/regist").init(app, db);

//路由守护
const cms_pages = { //cms 后台管理页面
    "/s/admin": "user",
    "/s/pros": "pros",
    "/s/orders": "order",
    "/s/article": "article",
}; 
app.use((req, res, next)=>{
    if(cms_pages[req.url.split("?")[0]]){ //需要用户登录验证路由
        if(req.session.uid){
            next();
        }else{
            res.redirect("/s/login"); //未登录用户将重定向登录页
        }
    }else{    
        next();
    }
});
Object.values(cms_pages).forEach((module_name)=>{
    require(`./module/${module_name}`).init(app, db); //注册 cms 后台管理页面
})

//未注册路由 404 跳转
app.use((req, res) => {
    res.status(404).render("404");
})