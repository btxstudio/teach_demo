const md5 = require("md5");

module.exports = {
    init: (app, db) => {

        //渲染登录页
        app.get("/s/login", (req, res) => {
            res.render("cms/login");
        })

        //登录接口
        app.post("/travel/user/api/login", (req, res) => {
            req.body.pwd = md5(req.body.pwd);
            db.find("users", req.body, (data) => {
                if (data.length === 1) { //登录成功

                    //通过 session 中间件保存用户登录会话信息（退出登录时清除）
                    req.session.uid = req.body.user_id + "_" + Math.random() * 1000;

                    res.redirect("/s/admin");
                } else { //登录失败
                    res.send(`
                        <script>
                            alert("账号或密码有误！");
                            location = "/s/login"
                        </script>
                    `)
                }
            })
        })

        //登出接口
        app.post("/travel/user/api/logout", (req, res) => {
            req.session.destroy(()=>{ //销毁 session
                res.send({
                    code: 200
                });
            });
        })

    }
};