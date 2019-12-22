const mong_cli = require("mongodb").MongoClient;

const ObjectId = require("mongodb").ObjectId;

//连接数据库（私有方法）
const _connect = (database, url="mongodb://127.0.0.1:27017", callback)=>{
    mong_cli.connect(url, (err, client)=>{
        if(!err){
            let db = client.db(database);
            callback(db, client);
        }else{
            console.log(err);
        }
    })
}

function DB(database, url){
    this.db = database;
    this.url = url;
}

DB.prototype = {

    //查询数据库方法
    find(collection_name, condition, cb, condition2={}){
        _connect(this.db, this.url, (db, client)=>{
            let result = db.collection(collection_name).find(condition),
                { limit, skip } = condition2;

            //限值数据量
            if(limit) result = result.limit(limit);

            //设置数据起始点
            if(skip) result = result.skip(skip);
            
            result.toArray((err, data)=>{ //toArray 方法可以直接在回调函数中以数组形式获取查询数据结果
                if(!err){
                    result.count().then((count)=>{    
                        cb(data, count);    
                    });
                }else{
                    console.log(err);
                }
                client.close();
            })
        })
    },

    //增加数据
    insert(collection, data, cb){
        _connect(this.db, this.url, (db, client)=>{
            let coll = db.collection(collection); //选择集合
            coll.insert(data, (err, append_data)=>{
                if(!err){
                    cb(append_data.ops);
                }else{
                    console.log(err);                    
                }
                client.close();
            })
        });
    },

    //删除数据
    delete(collection, data, cb){
        _connect(this.db, this.url, (db, client)=>{
            let coll = db.collection(collection); //选择集合
            coll.deleteOne(data, (err)=>{
                if(!err){
                    cb();
                }else{
                    console.log(err);                    
                }
                client.close();
            })
        });
    },

    //修改数据
    update(collection, data, mod_data, cb){
        _connect(this.db, this.url, (db, client)=>{
            let coll = db.collection(collection); //选择集合
            coll.updateOne(data, {$set: mod_data}, (err)=>{
                if(!err){
                    cb();
                }else{
                    console.log(err);                    
                }
                client.close();
            })
        });
    },

    //生成 ObjectId 对象
    get_object_id(id){
        return new ObjectId(id); //用于通过 _id 获取指定 mongo bson 数据
    }

}

module.exports = DB;