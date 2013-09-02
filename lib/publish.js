/**
 * 检查是否有package.json文件
 *     如果有则读取
 *     没有则报错 需要添加package.json文件
 * 检查是否有fisrc是否记录有username和_auth
 *     如果有则读取username和_auth
 *     没有则报错 添加用户名
 *  构造userObj和pkgObj
 *      userObj {
 *          name
 *          _auth
 *      }
 *      pkgObj {
 *          name
 *          version
 *      }
 *      op ： publish、unpublish、
 *第一步 ： 权限验证
 *  验证用户是否存在
 *      没有 则报错用户不存在
 *      有则
 *          验证publish的包是否存在存在
 *              不存在  返回验证成功
 *              存在
 *                  验证版本是否存在
 *                      不存在 验证用户是否有操作的权限
 *                          有 返回验证成功
 *                          没有  报错没有操作权限
 *                      存在 报错已经存在该版本，请修改version
 *第二步 : publish
 *   权限验证
 *      失败 : 显示失败原因
 *      成功 ： pkg打包上传，进行publish
 */

