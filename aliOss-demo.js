let OSS = require('ali-oss');
const fs = require('files');

(async () => {
  let client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: 'xxxx',
    accessKeySecret: 'xxxxxxx',
    bucket: 'xxx'
  });

  const files = await fs.walk('build')
  console.log(files, 'files')

  await files.forEach(item => {
    const filesArr = item.split('/build/');
    console.log(`Uploading ${filesArr[1]}`);
    client.put(`/${filesArr[1]}`, `build/${filesArr[1]}`).then((result) => {
      console.log(`Completed ${filesArr[1]} statusCode: ${result.res.statusCode}}`)
    }).catch(err => {
      console.log(err)
    })
  })

})()
