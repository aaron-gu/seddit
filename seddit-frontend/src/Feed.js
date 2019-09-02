import React from 'react';
import {BarLoader} from 'react-spinners';
import Cookies from 'js-cookie';
import $ from 'jquery';
import Post from './Post.js';
import { getRequest, postRequest } from './requests.js';


class Feed extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts: null,
            title: '',
            body: '',
            length: 0,
            page: 0,
            isLoading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        window.onscroll = () => {
            // console.log(window.innerHeight + document.documentElement.scrollTop + ' ' + document.documentElement.offsetHeight)
            if(document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop) == 0){
                this.loadPosts();
            }
        }
    }

    componentWillMount = () => {
        getRequest('feed/0/').then((response) => {
            this.setState({posts: response['feed']});
        });
    }

    componentDidMount = () => {
        // getRequest('feed/0/').then((response) => {
        //     this.setState({posts: response['feed']});
        // });

        // this.interval = setInterval(() => {
        //     getRequest('feed/0/').then((response) => {
        //         this.setState({posts: response['feed']});
        //     });
        // }, 60000);
    }

    isLoading = () => {
        return this.state.posts == null;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        if(e.target.name === "body"){
            this.setState({length: e.target.value.length});
        }
    }

    loadPosts = () => {
        this.setState({isLoading: true});
        var pagenum = this.state.page + 1;
        getRequest('feed/' + pagenum + '/').then((response) => {
            if(response['feed'].length > 0){
                this.setState({
                    posts: this.state.posts.concat(response['feed']),
                    page: pagenum
                });
            }
        });
        this.setState({isLoading: false});
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.length < 280){
            alert("Posts must be at least 280 characters long.");
            return;
        }
        postRequest('post/', {
            "user": Cookies.get('user'),
            "auth_token": Cookies.get('auth_token'),
            "title": this.state.title,
            "body": this.state.body
        }).then((response) => {
            var post = response['post'];
            var newPosts = this.state.posts.slice();
            newPosts.unshift(post);
            this.setState({posts: newPosts});
        });
        $("#closeModal").click();
    }

    render(){
        var feedItems;
        if(this.state.posts == null){
            return <BarLoader
              sizeUnit={"px"}
              size={40}
              loading={this.isLoading()}
            />
        }
        else if(this.state.posts.length === 0){
            feedItems = <div>No posts yet!</div>;
        }
        else{
            feedItems = this.state.posts.map((post, idx) =>
                <Post key={post['id']} id={post['id']} user={this.props.user} author={post['author']} title={post['title']} body={post['body']} created={post['created']} likes={post['likes']} /> 
            );
        }
        
        const writePostBtn = this.props.user ? <button className="btn btn-primary btn-lg" id="write-post" type="button" data-toggle="modal" data-target="#write-post-modal">Write Post</button> : "";
        
        return (
            <div className="mx-sm-5">
            <div className="mx-md-5">
                {feedItems}
                {writePostBtn}

                <BarLoader sizeUnit={"px"} size={40} loading={this.state.isLoading}/>

                <div className="modal fade" id="write-post-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Compose</h5>
                        <button type="button" id="closeModal" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="modal-body">
                            <input id="title" className="form-control" type="text" name="title" placeholder="What's on your mind?" value={this.state.title} onChange={this.handleChange} required /><br />
                            <textarea id="body" className="form-control" type="text" name="body" value={this.state.body} onChange={this.handleChange} required />
                        </div>
                        <div className="modal-footer">
                            <span>{this.state.length}</span>
                            <input type="submit" className="btn btn-primary" value="Post!" />
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>            
            </div>
        );
    }
}

export default Feed;