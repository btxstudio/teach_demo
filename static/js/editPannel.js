/*
config 配置：
del_api：删除操作接口 
mod_api：修改操作接口 
add_api：增加操作接口
img_path：图片资源路径

接口属性：
data-target：数据列表项，当中以 data-数据字段名 格式绑定编辑数据
data-cover：预览图及上传按钮
data-upload：file 表单元素
data-mod-btn：修改 | 新增数据按钮
data-del-btn：删除数据按钮
*/

{
    function editePannel(selector, config){
        this.$el = $(selector);
        this.mod_data = {};
        let mod_data = this.mod_data, //当前修改数据
            $mod_btn = this.$el.find("[data-mod-btn]"),
            $del_btn = this.$el.find("[data-del-btn]");
        $fm = this.$el.find("form"); //当前操作表单
    
        //点击列表：编辑数据
        this.$el.on("click", "[data-target]", function() {
            let data = this.dataset;
            if(data.id){ //修改数据
                mod_data.id = data.id; //绑定数据 id
                $del_btn.show(0);
            }else{ //新增数据
                $del_btn.hide(0);
            }
            $fm.find("[name]").each((i, inp) => {
                $(inp).val(data[$(inp).attr("name")]);
            })
            $fm.find("[data-cover]").attr("src", `${config.img_path}/${data.id}.jpg`);
        })

        //点击图片：上传文件
        $fm.find("[data-cover]").on("click", function(){
            let upload_file = $fm.find("[data-upload]"),
                $img = this;
            upload_file.trigger("click");
            upload_file.on("change", ()=>{

                //重置预览图
                let reads = new FileReader();                    
                reads.readAsDataURL(upload_file[0].files[0]);
                reads.onload = function(){
                    $img.src = this.result;
                };

            })
        })
    
        //修改数据 | 新增数据
        $mod_btn.on("click", ()=>{
            let post_method = "post_data";
            $fm.find("[name]").each((i, inp) => {
                if($(inp).attr("type") === "file"){ //上传文件表单数据
                    mod_data[$(inp).attr("name")] = inp.files[0];
                    post_method = "post_multi_data";
                }else{ //普通表单数据
                    mod_data[$(inp).attr("name")] = $(inp).val();
                }
            })
            this[post_method](config[mod_data.id? "mod_api": "add_api"]);
        })
    
        //删除数据
        $del_btn.on("click", ()=>{
            this.post_data(config.del_api)
        })

    }
    
    editePannel.prototype = {
        
        //显示操作结果
        show_oper_result(res){
            if (res.code == 200){
                alert(res.info);
                location.reload(); //重新渲染界面
            }
        },

        //发送 post 请求数据
        post_data(api){
            $.post(api, this.mod_data, this.show_oper_result)
        },

        //发送 post 请求数据及上传文件
        post_multi_data(api){
            let formdata = new FormData();
            for(let pro in this.mod_data){
                formdata.append(pro, this.mod_data[pro]);
            }
            $.ajax({
                type: "post",
                url: api,
                contentType: false,
                processData: false,
                data: formdata,
                success: this.show_oper_result
            })
        }
    
    }
    
    window.external.editePannel = editePannel;
}
