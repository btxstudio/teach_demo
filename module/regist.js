const md5 = require("md5");

module.exports = {
    init: (app, db)=>{

        //渲染注册页
        app.get("/s/regist", (req, res) => {
            res.render("cms/regist");
        })
    
        //注册接口
        app.post("/travel/user/api/regist", (req, res) => {
            req.body.user_id = "a" + Math.floor(Date.now()).toString();
            req.body.pwd = md5(req.body.pwd); //使用 md5 加密用户密码
            db.insert("users", req.body, ()=>{
                
                //通过 session 中间件保存用户登录会话信息（退出登录时清除）
                req.session.uid = req.body.user_id + "_" + Math.random() * 1000;
                
                res.send(`
                    <script>
                        alert("用户注册成功！");
                        location = "/s/admin";
                    </script>
                `);
            })
        })
    
    }
};

