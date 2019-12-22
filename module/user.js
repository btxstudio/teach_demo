const md5 = require("md5");

module.exports = {
    init: (app, db)=>{

        //渲染用户页（登录首页）
        app.get("/s/admin", (req, res) => {
            db.find("users", {}, (data)=>{
                res.render("cms/index", {
                    data,
                    data_name: "用户",
                    data_count: data.length
                })
            })
        })
    
        //修改用户信息接口
        app.post("/travel/users/api/mod", (req, res) => {
            req.body.pwd = md5(req.body.pwd);
            db.update("users", {_id: db.get_object_id(req.body.id)}, req.body, ()=>{
                res.send({
                    code: "200",
                    info: "用户信息修改成功！"
                })
            })
        })
    
        //删除用户信息接口
        app.post("/travel/users/api/del", (req, res) => {
            db.delete("users", {_id: db.get_object_id(req.body.id)}, ()=>{
                res.send({
                    code: "200",
                    info: "用户信息删除成功！"
                })
            })
        })
    
    }
};

