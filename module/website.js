module.exports = {
    init: (app, db) => {

        //首页
        app.get("/", (req, res) => {

            //【Controller：控制器层】处理首页数据，进行模板引擎页面渲染
            let render_data = {}

            db.find("articles", {}, (articles) => { //【Mode：数据层】
                render_data.about_article = articles[0]; //静态文章数据（平台介绍）

                //继续查找产品数据
                db.find("pros", {}, (pros) => { //【Mode：数据层】
                    render_data.pros = pros; //产品列表数据
                    res.render("index", render_data); //【View：视图层】
                }, { "limit": 4 })

            })

        })

        //产品列表页
        app.get("/pro_list", (req, res) => {

            //【Controller：控制器层】处理产品列表数据
            let page_count = 8, //单页显示列表数
                cur_page = req.query.page || 0, //当前页码
                condition2 = {
                    limit: page_count,
                    skip: cur_page * page_count
                }

            db.find("pros", {}, (pros, count) => { //【Mode：数据层】
                res.render("pro_list", { //【View：视图层】     
                    pros,
                    pages: Math.ceil(count / page_count) //总页数  
                });
            }, condition2)

        })

        //预定页
        app.get("/booking", (req, res) => {

            //【Controller：控制器层】处理产品预定详情数据
            let cur_pro = req.query.pro_id, //获取产品 id
                condition = {};

            if (cur_pro) condition._id = db.get_object_id(cur_pro);
            db.find("pros", condition, (pro_info, count) => { //【Mode：数据层】
                res.render("booking", { pro_info: pro_info[0] }); //【View：视图层】      
            })
            
        })

        //预定接口
        app.post("/booking", (req, res) => {

            //【Controller：控制器层】存储预定信息到数据库
            db.insert("pro_order", req.body, () => { //【Mode：数据层】
                res.send({
                    code: 200
                });
            })

        })

    }
};