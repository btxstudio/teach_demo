module.exports = {
    init: (app, db)=>{

        //渲染平台介绍文章页
        app.get("/s/article", (req, res) => {
            db.find("articles", {}, (data)=>{
                data = data[0];
                res.render("cms/article", { 
                    id: data._id,
                    title: data.title || "",
                    content: data.content.join("\n").trim() //格式化多行文章内容  
                });
            })
        })

        //修改文章接口
        app.post("/travel/article/api/mod", (req, res) => {
            req.body.content = req.body.content.split("\n");
            db.update("articles", {_id: db.get_object_id(req.body.id)}, req.body, ()=>{
                res.send({
                    code: "200",
                    info: "平台介绍信息修改成功！"
                })
            })
        })
    
    }
};

