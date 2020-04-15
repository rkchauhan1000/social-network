 const SocialNetwork= artifacts.require('./SocialNetwork.sol')

 require('chai').use(require('chai-as-promised')).should()

 contract('SocialNetwork',([deployer,author,tipper])=>{
 	
 	let socialNetwork
        before(async () => {
        	socialNetwork = await SocialNetwork.deployed()
        })
 	
 	describe('deployment', async ()=>{
 		
 		it('deploys successfully',async ()=>{
 		    const addr=await socialNetwork.address
            assert.notEqual(addr,0x0)
            assert.notEqual(addr,'')
            assert.notEqual(addr,null)
            assert.notEqual(addr,undefined)
          })
 	    
 	    it('has correct name',async ()=>{
 	    	
         assert.notEqual(socialNetwork.name,'')
 	    })	
 	})

 	describe('posts', async () =>{
 		
 		let result, postCount
        
        before(async() =>{
        result = await socialNetwork.createPost('This is my first post',{from : author})
 		postCount = await socialNetwork.no_post()	
        })
 		
 		it('create posts',async () =>{
          
          const event= result.logs[0].args
 		  assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
 		  assert.equal(event.author,author,'author is correct')
 		  assert.equal(event.content,'This is my first post','content is correct')
 		  assert.equal(event.tipAmount,'0','tip amount is correct')
 		  
 		await socialNetwork.createPost('',{from : author}).should.be.rejected;
 		})
 		
 		it('lists posts',async() =>{
 		  const post= await socialNetwork.posts(postCount)
 		  assert.equal(post.id.toNumber(),postCount.toNumber(),'id is correct')
 		  assert.equal(post.author,author,'author is correct')
 		  assert.equal(post.content,'This is my first post','content is correct')
 		  assert.equal(post.tipAmount,'0','tip amount is correct')
 		  

 		})
 		
 		it('allow users to tip posts', async() =>{
          
          let oldAuthorBalance
          oldAuthorBalance = await web3.eth.getBalance(author)
          oldAuthorBalance= new web3.utils.BN(oldAuthorBalance)		  
 
 		  result = await socialNetwork.tipPost(postCount, { from: tipper, value:web3.utils.toWei('1','Ether') })

          const event= result.logs[0].args
 		  assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
 		  assert.equal(event.author,author,'author is correct')
 		  assert.equal(event.content,'This is my first post','content is correct')
 		  assert.equal(event.tipAmount,'1000000000000000000','tip amount is correct')
          

          let newAuthorBalance
          newAuthorBalance = await web3.eth.getBalance(author)
          newAuthorBalance= new web3.utils.BN(newAuthorBalance)

          let tipAmount
          tipAmount= web3.utils.toWei('1','Ether')
          tipAmount= new web3.utils.BN(tipAmount)

          const expectedBalance=oldAuthorBalance.add(tipAmount)

          assert.equal(newAuthorBalance.toString(),expectedBalance.toString())

         await socialNetwork.tipPost(99, { from :tipper, value: web3.utils.toWei('1','Ether')}).should.be.rejected; 	  
   		  
 		})
 	})
 })