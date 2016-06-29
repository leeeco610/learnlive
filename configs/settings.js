module.exports = { 
  cookieSecret: 'myblog', 
  db: 'blog', //使用的数据库
  host: 'localhost',  //数据库地址
  port: '27017',  //数据库端口
  httpport: '8080',  //网页服务运行的端口
  usepwd: 'false',  //是否使用用户名和密码登录数据库
  username: '',  //可选，登录数据库的用户名，由于会话保存的配置与博客共享，请保证此用户名在之前使用的数据库中被创建而不是在admin中创建
  password: '',  //可选，登录数据库的密码
  sitename: 'Hello World！',  //站点名字
  sitedescription: '又一个LightBlog站点'  //站点描述
}; 
