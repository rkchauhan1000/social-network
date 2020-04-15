pragma solidity ^0.5.0;

/**
 * The SocialNetwork contract does this and that...
 */
contract SocialNetwork {

    string public name;

    mapping(uint => Post) public posts;
    struct Post {
	    address payable author ;
	    uint id;
	    string content;
	    uint tipAmount;
    }

    event postCreated(address payable author, uint id , string content, uint tipAmount);
    event postTip(address payable author, uint id , string content, uint tipAmount);

    uint public no_post=0;

    constructor() public

    {
        name="Social Network";
    }

    function createPost(string memory _content) public {
	    
	    require (bytes(_content).length>0);
	    
	    no_post++;

	    posts[no_post] = Post(msg.sender,no_post,_content,0);
        emit postCreated(msg.sender,no_post,_content,0);
    }

    function tipPost(uint _id) public payable{
    
       require (_id>0 && _id <=no_post);
          
    Post memory _post= posts[_id];

    address payable _author=_post.author;

    address(_author).transfer(msg.value);

    _post.tipAmount=  _post.tipAmount+msg.value;

    posts[_id]=_post;
    emit postTip(_author,no_post,_post.content,_post.tipAmount);

  
}
}


