/**
 * FIS3�����ļ�
 */
/*
// �� md5
fis.match('*.{js,css,png}', {
    useHash: false
});

// ���� fis-spriter-csssprites ���
fis.match('::package', {
    spriter: fis.plugin('csssprites')
});

// �� CSS ����ͼƬ�ϲ�
fis.match('*.css', {
    // ��ƥ�䵽���ļ��������� `useSprite`
    useSprite: false
});

 fis.match('*.js', {
 // fis-optimizer-uglify-js �������ѹ����������
 optimizer: fis.plugin('uglify-js')
 });

fis.match('*.css', {
    // fis-optimizer-clean-css �������ѹ����������
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    // fis-optimizer-png-compressor �������ѹ����������
    optimizer: fis.plugin('png-compressor')
});

//������ʱ�򿪷���ʱ����Ҫѹ�����ϲ�ͼƬ��Ҳ����Ҫ hash����ô����������׷���������ã�
 fis.media('debug').match('*.{js,css,png}', {
     useHash: false,
     useSprite: false,
     optimizer: null
 })



 //�������޸���Դ����·��
 fis.match('*.{js,css,png,gif}', {
 useHash: true // ���� md5 ��
 });

 // ���е� js
 fis.match('**.js', {
 //������/static/js/xxxĿ¼��
 release : '/static/js$0'
 });

 // ���е� css
 fis.match('**.css', {
 //������/static/css/xxxĿ¼��
 release : '/static/css$0'
 });

 // ����imageĿ¼�µ�.png��.gif�ļ�
 fis.match('/images/(*.{png,gif})', {
 //������/static/pic/xxxĿ¼��
 release: '/static/pic/$1$2'
 });

 //�ϴ���Զ�̷�����   ���fis3 release product
 fis.media('product').match('*', {
     deploy: fis.plugin('http-push', {
         receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
         to: '/home/work/htdocs' // ע�������ָ���ǲ��Ի�����·������Ǳ��ػ���
     })
 });

 //ÿ��ҳ��һ���ϲ���һ��CSS��JS
 fis.match('::package', {
     postpackager: fis.plugin('loader', {
        allInOne: true
     })
 });
*/

//���ԣ����ù������ļ�Ŀ¼
fis.set('project.ignore', [
    'node_modules/**',
    '.git/**',
    '.svn/**'
]);

//���
fis.match('*', {
    deploy: fis.plugin('local-deliver', {
        to: '/Users/lihaipeng/Downloads/_output/learnlive'
    })
});


//JSѹ��
fis.match('public/js/*.js', {
    useHash:true,  //MD5
    optimizer: fis.plugin('uglify-js')
});
//cssѹ��
fis.match('public/**/*.css', {
    optimizer: fis.plugin('clean-css')
});
fis.match('public/css/*.css',{
    useHash:true
});
//htmlѹ��
fis.match('views/**/*.html', {
    optimizer: fis.plugin('html-minifier')
    //invoke fis-optimizer-html-minifier
});
