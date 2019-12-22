module.exports = {
    init: (app, db)=>{

        //渲染订单列表页
        app.get("/s/orders", (req, res) => {
            db.find("pro_order", {}, (data)=>{
                db.find("pros", {}, (pros)=>{

                    //设置预定产品名
                    let pro_info = {};
                    pros.forEach((pro)=>{
                        pro_info[pro._id] = pro.title;
                    })
                    data.forEach((item)=>{
                        item.pro_name = pro_info[item.pro_id]; 
                    })

                    res.render("cms/orders", {
                        data,
                        data_name: "订单",
                        data_count: data.length
                    })
                })
            })
        })
    
        //删除订单信息接口
        app.post("/travel/pro_order/api/del", (req, res) => {
            db.delete("pro_order", {_id: db.get_object_id(req.body.id)}, ()=>{
                res.send({
                    code: "200",
                    info: "订单信息删除成功！"
                })
            })
        })
    
    }
};

