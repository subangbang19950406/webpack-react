import React from 'react';
import styles from './App.scss';
import Test from './test';
import Logo from 'logo.png';
import Add from 'common/index'
//,由于React使用ES6编写代码,而ES6又有class的概念,所以为了不混淆class选择器在React中写成了className
//CSS Modules写法===> styles.title
//styleName可以替代className，自行百度
// console.log(styles)
class App extends React.Component{
    render(){
        return (
            <div className={styles.title}>Hello, jianshu - react111
            <img src={Logo} />
            <Test />
            <Add />
            </div>
            
        );
    }
}
export default App;