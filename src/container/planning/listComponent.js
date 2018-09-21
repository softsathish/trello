import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
class ListComponent extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            cardDetail: this.props.cardDetail,
            editTitle:false,
            showEditCard:false,
            cardToEdit:{},
            cardIndex:null
        }
        this.editTitleFn = this.editTitleFn.bind(this);
        this.hideEditTitle = this.hideEditTitle.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.editCard = this.editCard.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.cardTitleChange = this.cardTitleChange.bind(this);
        this.descriptionChange = this.descriptionChange.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.drop = this.drop.bind(this);

        this.dragStartIndexes = [];
    }
   
    editTitleFn(){
        this.setState({
            editTitle:true
        })
    }
    hideEditTitle(event){
        this.setState({
            editTitle:false
        })
        event.preventDefault();
    }
    handleTitleChange(event){
        let cardDetail = this.state.cardDetail;
        cardDetail.title = event.target.value;
        this.setState({
            cardDetail:cardDetail
        })
    }
    editCard(event, card, cardIndex){
        this.setState({
            cardToEdit: JSON.parse(JSON.stringify(card)),
            showEditCard:true,
            cardIndex:cardIndex
        })
    }
    closeModal(){
        this.setState({
            showEditCard:false
        })
    }
    cardTitleChange(event){
        let cardDetail = this.state.cardDetail;
        cardDetail.cardList[this.state.cardIndex].title = event.target.value
        this.setState({
            cardDetail:cardDetail
        })
    }
    descriptionChange(event){
        let cardDetail = this.state.cardDetail;
        cardDetail.cardList[this.state.cardIndex].description = event.target.value
        this.setState({
            cardDetail:cardDetail
        })
    }
    deleteCard(){
        let cardDetail = this.state.cardDetail;
        delete cardDetail.cardList[this.state.cardIndex];
        this.setState({
            cardDetail:cardDetail
        }, function(){
            this.closeModal();
        })
    }
    allowDrop(ev, listCount, colIndex) {
        ev.preventDefault();
    }
    
    dragStart(ev, listCount, colIndex){
        this.dragStartIndexes = [];
        this.dragStartIndexes.push(listCount);
        this.dragStartIndexes.push(colIndex);
        ev.dataTransfer.setData("dragStartIndexes", JSON.stringify(this.dragStartIndexes));
    }
    
    drop(ev, listCount) {
        let planningList = this.props.planningList;
        let indexes = JSON.parse(ev.dataTransfer.getData("dragStartIndexes"));
        if(planningList[indexes[0]] && listCount != indexes[0]){
            var movedObj = planningList[indexes[0]].cardList[indexes[1]];
            if(movedObj){
                if(!planningList[listCount].cardList)
                    planningList[listCount].cardList = []
                planningList[listCount].cardList.push(movedObj);
                delete planningList[indexes[0]].cardList[indexes[1]];                
                this.props.updateCard(planningList);
            }
            
        }
        ev.preventDefault();
    }
    render(){
        let cardDetail = this.state.cardDetail;
        let cardToEdit = this.state.cardToEdit;
        return(
            <div className="js-list list-wrapper"
                onDrop={(event, listCount) => this.drop(event, this.props.listCount)} 
                onDragOver={(event) => this.allowDrop(event)}
            >
                <div className="list js-list-content">
                    <div className="list-header js-list-header u-clearfix is-menu-shown">
                        <form onSubmit={this.hideEditTitle}>
                        {
                            this.state.editTitle ?
                            <input type="text" className="list-header-name mod-list-name js-list-name-input" aria-label="Things To Do" spellCheck="false" dir="auto" maxLength="512" 
                            defaultValue={ cardDetail.title } autoFocus={true} onChange={this.handleTitleChange} />
                            :<div onClick={this.editTitleFn}><b className="js-list-name-assist" dir="auto">{ cardDetail.title }</b></div>
                        }
                        </form>
                    </div>
                    <div className="list-cards u-fancy-scrollbar u-clearfix js-list-cards js-sortable ui-sortable"
                        
                    >
                        {
                            cardDetail.cardList ?
                            cardDetail.cardList.map((card, index) => {
                                let cardToEdit = card;
                                let colIndex = index;
                                return (
                                    <a className="list-card js-member-droppable ui-droppable" key={card} 
                                        onDragStart={(event, listCount, index) => this.dragStart(event, this.props.listCount, colIndex)}
                                        draggable="true"
                                        onClick={(event, card) => this.editCard(event, cardToEdit, index)}>
                                        <div className="list-card-cover js-card-cover">
                                            <span className="icon-sm icon-edit list-card-operation dark-hover js-open-quick-card-editor js-card-menu">
                                            </span>
                                            <div className="list-card-stickers-area hide"><div className="stickers js-card-stickers"></div></div>
                                            <div className="list-card-details">
                                                <div className="list-card-labels js-card-labels"></div>
                                                <span className="list-card-title js-card-name" dir="auto"><span className="card-short-id hide">#3
                                                    </span>{ card.title }</span>
                                                { card.description ?
                                                    <div className="badges">
                                                        <span className="js-badges">
                                                            <div className="badge is-icon-only" title="This card has a description.">
                                                                <span className="badge-icon icon-sm icon-description"></span>
                                                            </div>
                                                        </span>
                                                        <span className="custom-field-front-badges js-custom-field-badges">
                                                            <span></span>
                                                        </span>
                                                    <span className="js-plugin-badges">
                                                        <span></span>
                                                    </span>
                                                </div>
                                                :''}
                                            </div>
                                        </div>
                                    </a>
                                )
                            })
                            :''
                        }
                    </div>
                    <a className="open-card-composer js-open-card-composer" onClick={(event, cardDetail) => this.props.addCard(event, this.props.cardDetail, this.props.listCount)}>
                        <span className="icon-sm icon-add"></span>
                        {
                            cardDetail.cardList && cardDetail.cardList.length > 0 ?                         
                            <span className="js-add-another-card">Add another card</span>
                            :<span className="js-add-a-card">Add a card</span>                            
                        }
                    </a>
                </div>
                <Modal isOpen={this.state.showEditCard} external={<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button>}>
                    <ModalHeader toggle={this.closeModal}>
                        Edit Card
                    </ModalHeader>
                    <ModalBody>
                        <div className="window-header mod-card-detail-icons-smaller">
                            <span className="window-header-icon icon-lg icon-card"></span>
                            <div className="window-title">
                                <h2 className="card-detail-title-assist js-title-helper" dir="auto">{ cardToEdit.title }</h2>                                
                                <input className="list-name-input" type="text" name="name" placeholder="Enter list title..." 
                                            autoComplete="off" dir="auto" maxLength="512" onChange={this.cardTitleChange} autoFocus={true} defaultValue={cardToEdit.title} />
                            </div>
                            {/* <div className="window-header-inline-content quiet js-current-list">
                                <p className="u-inline-block u-bottom">in list <a href="#" className="js-open-move-from-header">Testdfdf</a></p>
                            </div> */}
                            <div className="window-header-inline-content hide js-subscribed-indicator-header"><span className="icon-sm icon-subscribe"></span></div>
                        </div>
                        <div class="window-module">
                            <div class="window-module-title window-module-title-no-divider">
                                <span class="icon-description icon-lg window-module-title-icon"></span>
                                <h3 class="u-inline-block">Description</h3>
                                <a class="card-detail-item-header-edit hide-on-edit js-show-with-desc js-edit-desc hide" href="#">Edit</a>
                            </div>
                            <div class="u-gutter js-hide-on-minimize-desc">
                                <div class="editable" attr="desc">
                                    <div class="description-content js-desc-content">
                                    <textarea class="field js-description-draft card-back-description" 
                                        onChange={this.descriptionChange}
                                        placeholder="Add a more detailed description…" defaultValue={cardToEdit.description}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div>&nbsp;</div>
                            <div className="text-right">
                                Delete this card? <button className="btn btn-outline-danger" onClick={this.deleteCard}>Delete</button>
                            </div>
                            
                        </div>
                    </ModalBody>
                     <ModalFooter>
                        {/* <button className="btn btn-primary" onClick={this.applyChanges}>Apply</button> */}
                        
                        <button className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ListComponent;