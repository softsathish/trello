import React, { Component } from 'react'
import ListComponent from './listComponent';
import { PlanningConfig } from './../../data/planningConfig';
import './planning.css';
class PlanningComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            planningList:[],
            toggleAddListField:false,
            title:'',
            editTitle:false
        }
        this.handleAddList = this.handleAddList.bind(this);
        this.addCard = this.addCard.bind(this);
        this.showAddList = this.showAddList.bind(this);
        this.handleListTitleAdd = this.handleListTitleAdd.bind(this);
        this.hideAddList = this.hideAddList.bind(this);
        this.editTitle = this.editTitle.bind(this);
        this.updateCard = this.updateCard.bind(this);
    }
    componentDidMount(){
        this.getDefaultConfig();
    }
    getDefaultConfig(){
        this.setState({
            planningList: JSON.parse(JSON.stringify(PlanningConfig))
        })
    }
    handleListTitleAdd(event){
        this.setState({
            title:event.target.value
        })
    }
    showAddList(){
        this.setState({
            toggleAddListField:true
        })
    }
    hideAddList(event){
        this.setState({
            toggleAddListField:false
        })
        event.preventDefault();
    }
    handleAddList(event){        
        if(!this.state.title){
            event.preventDefault();
            return false;
        }            
        var newList = {title:this.state.title};
        var planningList = this.state.planningList;
        planningList.push(newList);
        this.setState({
            planningList:planningList,
            title:''
        })
        event.preventDefault();
        this.hideAddList(event);
    }
    addCard(event,obj, listCount){
        var planningList = this.state.planningList;
        var index = listCount;
        if(planningList[index].cardList){
            planningList[index].cardList.push({title:'Add Title'})
        }else{
            planningList[index].cardList = [];
            planningList[index].cardList.push({title:'Add Title'})
        }
        this.setState({
            planningList:planningList
        })
        
    }
    editTitle(){
        var planningList = this.state.planningList;
    }
    updateCard(planningList){
        this.setState({
            planningList:planningList
        })
    }
    render(){
        let planningList = this.state.planningList;
        return(
            <div id="content">
                <div className="board-wrapper1">
                    <div className="board-main-content">
                        <div className="board-header u-clearfix js-board-header">
                            <a className="board-header-btn board-header-btn-name js-rename-board" href="#">
                                <span className="board-header-btn-text" dir="auto">Vacation Planning</span>
                            </a>
                        </div>
                        <div className="board-canvas">
                            <div id="board1" className="u-fancy-scrollbar js-no-higher-edits js-list-sortable ui-sortable">
                                {
                                    planningList.map( (plan, index) => {
                                        return <ListComponent addCard={this.addCard} key={plan.id} cardDetail={ plan }
                                            editTitle={this.editTitle} planningList={planningList} updateCard={this.updateCard}
                                            listCount={index}
                                        ></ListComponent>
                                    })
                                }
                                <div className={`js-add-list list-wrapper mod-add  ${!this.state.toggleAddListField ? " is-idle ":""}`}>
                                    <form onClick={this.showAddList} onSubmit={(event) => this.handleAddList(event)} method="post">
                                        <span className="placeholder js-open-add-list">
                                            <span className="icon-sm icon-add"></span>Add another list
                                        </span>
                                        {
                                            this.state.toggleAddListField ?                                        
                                        <input className="list-name-input" type="text" name="name" placeholder="Enter list title..." 
                                            autoComplete="off" dir="auto" maxLength="512" onChange={this.handleListTitleAdd} autoFocus={true} /> : ''
                                        }
                                        <div className="list-add-controls u-clearfix">
                                            <input className="primary mod-list-add-button js-save-edit" type="submit" value="Add List" />
                                            <a className="icon-lg icon-close dark-hover js-cancel-edit" onClick={(event) => this.hideAddList(event)}></a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );        
    }
}
export default PlanningComponent;