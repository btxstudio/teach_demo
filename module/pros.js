const fs = require("fs");
const multiparty = require("multiparty");
const uploadDir = "./static/img"; //配置上传文件目录（相对或绝对路径，不能是根目录：“/”）

module.exports = {
    init: (app, db)=>{

        //渲染产品列表页
        app.get("/s/pros", (req, res) => {
            db.find("pros", {}, (data)=>{
                res.render("cms/pros", { data })
            })
        })

        //修改产品信息接口
        app.post("/travel/pros/api/mod", (req, res) => {            
            const form = new multiparty.Form({ uploadDir });
            form.parse(req, (err, post_data, files)=>{ 
                if(!err){ 
                    let data_id = post_data.id[0];
                    for(let pro in post_data){
                        post_data[pro] = post_data[pro][0];
                    }
                    db.update("pros", {_id: db.get_object_id(data_id)}, post_data, ()=>{
                        
                        //重命名上传文件
                        files.cover && fs.renameSync(files.cover[0].path, `./static/img/${data_id}.jpg`);
                          
                        res.send({
                            code: "200",
                            info: "产品信息修改成功！"
                        })
                    })
                }else{
                    console.log(err);
                }
            })
        })
    
        //删除产品信息接口
        app.post("/travel/pros/api/del", (req, res) => {
            db.delete("pros", {_id: db.get_object_id(req.body.id)}, ()=>{
                res.send({
                    code: "200",
                    info: "产品信息删除成功！"
                })
            })
        })

        //新增产品信息接口
        app.post("/travel/pros/api/add", (req, res) => {
            const form = new multiparty.Form({ uploadDir });
            form.parse(req, (err, post_data, files)=>{
                if(!err){
                    let data_id;
                    for(let pro in post_data){
                        post_data[pro] = post_data[pro][0];
                    }
                    db.insert("pros", post_data, (opts)=>{

                        //重命名上传文件
                        data_id = opts[0]._id;
                        files.cover && fs.renameSync(files.cover[0].path, `./static/img/${data_id}.jpg`);

                        res.send({
                            code: "200",
                            info: "产品信息添加成功！"
                        })
                    })
                }else{
                    console.log(err);
                }
            })
        })
    
    }
};

