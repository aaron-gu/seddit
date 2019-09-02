import React from 'react';
import { getRequest, postRequest } from './requests.js';
import {BarLoader} from 'react-spinners';

class Post extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            commenting: false
        }
        this.toggleComment = this.toggleComment.bind(this);
    }

    isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
          someDate.getMonth() === today.getMonth() &&
          someDate.getFullYear() === today.getFullYear()
    }

    formatDate(date){
        date = new Date(date);
        date = new Date(date.getTime() - date.getTimezoneOffset()*60000);
        if(this.isToday(date)){
            return date.toLocaleTimeString('en-US', {hour12: true, hour: "numeric", minute: "numeric"})
        }
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    toggleComment(){
        if(this.props.user)
            this.setState({commenting: !this.state.commenting});
        else
            alert('Please login');
    }

    render(){
        return (
            <div className="card my-4 mx-md-3">
                <p className="card-header">{this.props.author} <span className="text-muted ml-3">{this.formatDate(this.props.created)}</span></p>
                <div className="card-body">
                    <h2 className="card-title">{this.props.title}</h2>
                    <p className="card-text">{this.props.body}</p>
                    <Like post_id={this.props.id} user={this.props.user} />  
                    <a role="button" className="btn btn-light card-link" onClick={this.toggleComment}>Comment</a>
                </div>
                <div className="card-footer">
                    <Comment post_id={this.props.id} user={this.props.user} sendComment={this.state.commenting} toggleView={this.toggleComment} />
                </div>
            </div>
        );
    }
}

class Like extends React.Component{
    constructor(props){ 
        super(props);
        // props should be the post id, and make a separate request for the number of likes on the post so it can update state
        this.state = {
            likes: null,
            liked: null
        };
        this.getLikes = this.getLikes.bind(this);
        this.isLiked = this.isLiked.bind(this);
        this.handleClick = this.handleClick.bind(this);
        
    }
    componentDidMount = () => {
        this.getLikes();
        this.isLiked();

        this.interval = setInterval(() => {
            this.getLikes();
            this.isLiked();
        }, 30000);
    }
    getLikes(){
        getRequest("like/"+this.props.post_id+'/').then((response) => {
            this.setState({likes: response['likes']})
        });
    }
    isLiked(){
        if(this.props.user){
            postRequest('isliked/', {"user": this.props.user, "post_id": this.props.post_id}).then((response) => {
                this.setState({liked: response['liked']});
            });
        } else{
            this.setState({liked: false});
        }
    }
    handleClick(e){
        e.preventDefault();

        if(!this.props.user){
            alert('Please login');
            return;
        }

        if(this.state.liked){ // send unlike
            postRequest("unlike/", {"user": this.props.user, "post_id": this.props.post_id}).then((response) => {
                if(response['status'] === 'OK'){
                    this.setState({
                        likes: this.state.likes - 1,
                        liked: false
                    });
                }
                    
            });
        } else{ // send like
            postRequest("like/" + this.props.post_id + '/', 
                {"user": this.props.user, "post_id": this.props.post_id}
            ).then((response) => {
                if(response['status'] === 'OK')
                    this.setState({
                        likes: this.state.likes + 1,
                        liked: true
                    });
            });
        }
    }
    render(){
        return(
            <a role="button" className="btn btn-outline-light card-link" onClick={this.handleClick}>
                {this.state.liked ? 
                <img src={process.env.PUBLIC_URL + '/images/like-color.svg'} width="45" height="30" alt="" /> :
                <img src={process.env.PUBLIC_URL + '/images/like-gray.svg'} width="45" height="30" alt="" /> }
                <span className="ml-1">{this.state.likes}</span>
            </a>
        );
    }
}

class Comment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rows: 1,
            body: "",
            comments: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        getRequest('allcomments/' + this.props.post_id + '/').then((response) => {
            const commentsRes = response['comments'];
            this.setState({comments: commentsRes})
        });

        this.interval = setInterval(() => {
            getRequest('allcomments/' + this.props.post_id + '/').then((response) => {
                const commentsRes = response['comments'];
                this.setState({comments: commentsRes})
            });
        }, 30000);
    }
    handleSubmit(event){
        event.preventDefault();

        if(!this.props.user){
            alert('Please login');
            return;
        }

        postRequest('allcomments/' + this.props.post_id + '/', 
            {"user": this.props.user, "body": this.state.body}
        ).then((response) => {
            var comment = response['comment'];
            this.setState({comments: this.state.comments.concat({
                    "user": comment['user'], "body": comment['body'], "id": comment['id']
                })
            });
        });

        this.props.toggleView();
    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    isLoading = () => {
        return this.state.posts == null;
    }

    render(){
            if(this.state.comments == null){
                return <BarLoader
                    sizeUnit={"px"}
                    size={40}
                    loading={this.isLoading()}
                />
            }
            var displayComments;
            // console.log(this.state.comments);
            if(this.state.comments.length > 0){
                displayComments = this.state.comments.map((comment, idx) =>
                    <div className="comment" key={comment['id']}>
                        <p><b>{comment['user']}:</b> {comment['body']}</p>
                    </div>
                );
            } else {
                displayComments = (
                    <p className="text-muted">No comments!</p>
                );
            }
            var typeComment = this.props.sendComment ? 
                <div className="mb-3">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-row">
                        <div className="w-75 col-auto">
                        <textarea className="form-control" name="body" rows={this.state.rows} onChange={this.handleChange} placeholder="Comment" required ></textarea>
                        </div>
                        <div className="w-25 col-auto">
                        <input type="submit" className="btn btn-secondary" value="Send" />
                        </div>
                    </div>
                </form>
                </div>
                : "";
            return(
                <div>
                    {typeComment}
                    {displayComments}
                </div>
            );
        
    }
}

export default Post;