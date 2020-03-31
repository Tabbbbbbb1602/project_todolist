import React, { Component } from 'react';
import TaskForm from './component/TaskForm';
import Control from './component/Control';
import TaskList from './component/TaskList';
import './App.css';
//import _ from 'lodash'; //sử dụng cả thư viện lodash
//import {findIndex, filter} from 'lodash';//Chỉ những cái sử dụng

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      tasks : [],// id: unique, name, status
      isDisplayForm : false,
      tasksEditing : null,
      filter : {
        name : '',
        status : -1
      },
      keyword : '',
      // sort : {
      //   by : 'name',
      //   value : 1
      // }
      sortBy : 'name',
      sortValue : 1
    };
  }

  
  componentWillMount(){// khi bấm f5 thì conponentwillmout được gọi
    if(localStorage && localStorage.getItem('tasks')){
      var tasks = JSON.parse(localStorage.getItem('tasks'));// chuyen string sang object
      this.setState({
        tasks : tasks
      }); 
    }
  }
  //tạo id không trùng
  s4(){
    return Math.floor((1+Math.random()) *0x1000).toString(16).substring(1);
  }

  onGenerateID(){
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4();
  }
  //Bắt sự kiện đóng mở taskForm khi thêm và sửa
  onToggleForm = () =>{
    if(this.state.isDisplayForm && this.state.tasksEditing !== null){
      this.setState({
        isDisplayForm : true,
        tasksEditing : null
      });
    }else{
      this.setState({
        isDisplayForm :! this.state.isDisplayForm,
        tasksEditing : null
      });
    }
  }
  //Bắt sự kiện dấu chéo đóng form
  onCloseForm = ()=>{
    this.setState({
      isDisplayForm : false
    });
  }
  //nhận state từ TaskForm ra là một data
  onSubmit = (data) =>{
    var {tasks} = this.state;
    if(data.id === ''){
      data.id = this.onGenerateID();//data là một cái task
      tasks.push(data);
    }else{
      var index = this.findIndex(data.id);
      tasks[index] = data;
    }
    this.setState({
      tasks : tasks,
      tasksEditing : null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  //sự kiện mở lên cái form để sửa
  onShowForm = () =>{
    this.setState({
      isDisplayForm : true
    })
  }

  onDelete = (id) =>{
    var {tasks} = this.state;
    var index = this.findIndex(id);
    if(index !== -1){
      tasks.splice(index, 1);
      this.setState({
        tasks : tasks
      });
      localStorage.setItem('tasks',JSON.stringify(tasks));
    }
  }
  
onUpdateStatus = (id) =>{
  var {tasks} = this.state;
  var index = this.findIndex(id);
  //var index = _.findIndex(tasks, (task) =>{// tasks là cái tasks đem đi tìm kiếm , task là cái task trả về sau khi tìm kiếm
  // var index = findIndex(tasks, (task)=>{
  //   return task.id === id;
  // });
  if(index !== -1){
    tasks[index].status =! tasks[index].status;
    this.setState({
      tasks : tasks
    });
  }
}

onUpdate = (id) =>{
  var {tasks}= this.state;
  var index = this.findIndex(id);
  var tasksEditting = tasks[index];
  this.setState({
    tasksEditing : tasksEditting
  });
  this.onShowForm();
}
findIndex = (id) =>{
  var {tasks} = this.state;
  var result = -1
  tasks.forEach((task, index) =>{
    if(task.id === id){
      result = index;
    }
  });
  return result;
}

onFilter = (filtername, filterStatus) =>{
  console.log(filtername, filterStatus);//log xem trạng thái
  filterStatus = parseInt(filterStatus, 10);
  this.setState({
    filter : {
      name : filtername.toLowerCase(),
      status : filterStatus
    }
  });
}
onSearch = (keyword)=>{
  this.setState({
    keyword : keyword
  });
}

onSort = (sortBy, sortValue)=>{
  this.setState({
    sortBy : sortBy,
    sortValue :sortValue
  });
  
}
  render(){
    var { tasks, isDisplayForm, tasksEditing, filter, keyword, sortBy, sortValue} = this.state;//var tasks = this.state.tasks;
    if(filter){
      if(filter.name){
        tasks = tasks.filter((task)=>{
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      /*if(filter.status){//!== null !== indefined !== 0
        tasks = tasks.filter((task)=>{
          if(filter.status === -1){
            return task;
          }else{
            return task.status === (filter.status === 1 ? true : false);
          }
        });
      }*/
      tasks = tasks.filter((task)=>{
        if(filter.status === -1){
          return task;
        }else{
          return task.status === (filter.status === 1 ? true :false);
        }
      });
    }

     if(keyword){
       tasks = tasks.filter((task)=>{
         return task.name.toLowerCase().indexOf(keyword) !==-1;
       });
     }

    //   tasks = _.filter(tasks, (task)=>{
    //   tasks = filter(tasks, (task)=>{
    //   return  task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    // });


    if(sortBy === 'name'){
      tasks.sort((a,b)=>{
        if(a.name > b.name) return sortValue;
        else if(a.name < b.name) return -sortValue;
        else return 0;
      });
    }else{
      tasks.sort((a,b)=>{
        if(a.status < b.status) return sortValue;
        else if(a.status > b.status) return -sortValue;
        else return 0;
      });
    }

    var elmTaskForm = isDisplayForm ? <TaskForm onSubmit = {this.onSubmit} onCloseForm = {this.onCloseForm} task = {tasksEditing} /> : '';
    return(
      <div className="container">
        <div className="text-center">
            <h1>Quản Lý Công Việc</h1>
            <hr/>
        </div>
        <div className="row">
            <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : '' }>
                {elmTaskForm}
            </div>
            <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12' }>
                <button type="button" className="btn btn-primary" onClick ={this.onToggleForm}>
                    <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                </button>
                <Control onSearch = {this.onSearch}
                        onSort = {this.onSort}
                        sortBy = {sortBy}
                        sortValue = {sortValue}
                        />
                <div className="row mt-15">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <TaskList
                                onUpdateStatus ={this.onUpdateStatus}
                                onDelete = {this.onDelete} 
                                onUpdate = {this.onUpdate}
                                onFilter = {this.onFilter}
                                />
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
  }
}

export default App;
