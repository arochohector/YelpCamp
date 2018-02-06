var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

var data = [{
    name: "Clouds Rest",
    image: "http://www.photosforclass.com/download/9667057875",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac feugiat tellus. Phasellus dictum luctus pulvinar. Morbi a molestie ante. Etiam ultrices, ligula eu viverra eleifend, leo sem iaculis mi, vitae pharetra orci ex ac arcu. Aenean sit amet enim sit amet libero dapibus finibus sit amet in velit. Aliquam at ex quam. Suspendisse posuere sagittis justo a dictum. Maecenas at ultricies odio, nec iaculis ex. In sed dapibus orci. Integer id venenatis lacus. Aenean in quam lobortis, accumsan felis in, scelerisque velit. Maecenas lobortis velit non mi volutpat fermentum. Etiam sapien arcu, fringilla id nisi ac, mattis iaculis orci. Pellentesque quis ante tortor. Nunc ultrices pellentesque metus eget ultrices. Maecenas volutpat eros risus, sit amet ultrices enim sodales a."
}, {
    name: "Yellow Mountain",
    image: "https://farm6.staticflickr.com/5334/9925256586_c06d949b3e.jpg",
    description: "Duis quis auctor urna. Aliquam erat volutpat. Donec non leo gravida, finibus velit at, tempus massa. Donec porta diam eget eros pharetra consectetur. Donec euismod nisi non mi pretium convallis. Suspendisse potenti. Donec cursus fringilla odio vel finibus. Integer ut eros urna. Duis leo magna, pellentesque id risus ac, faucibus facilisis dui. Etiam molestie facilisis pharetra. Pellentesque blandit urna id ex maximus, eu sodales quam pellentesque. Vestibulum elit ante, sollicitudin ut dolor eu, mattis suscipit nisi. Etiam congue ipsum eget ligula tincidunt, nec luctus quam sagittis. Vestibulum ac bibendum nisi, ac dignissim mauris. Cras porta dui ut ipsum feugiat, vitae imperdiet sem viverra. Mauris elementum ut est id venenatis."
}, {
    name: "Morro Bay",
    image: "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
    description: "Nunc vel diam vel eros eleifend finibus a eu quam. Praesent semper lectus sed sem ultricies, sit amet hendrerit ante sodales. Donec semper condimentum tempor. Morbi tincidunt tristique leo, in pellentesque est pellentesque id. Phasellus pharetra lacus scelerisque augue dictum, sed rhoncus tortor feugiat. Nulla faucibus efficitur justo non posuere. Vivamus quis justo quis nisl iaculis suscipit. Nullam condimentum ultricies risus, a luctus justo porta eget. Praesent dignissim lectus viverra libero tristique, sit amet imperdiet erat finibus. Etiam ullamcorper imperdiet vestibulum. Integer non varius eros, et bibendum felis. Duis pellentesque nisl mauris, ut feugiat tortor pharetra ut. Fusce quis purus eu ligula consectetur accumsan nec sit amet lectus. Nullam in egestas nisl. Ut sit amet lobortis risus. Morbi finibus elit sapien, eu efficitur dui interdum eget."
}];

function seedDB(){
    // Clears all campgrounds from database.
    Campground.remove({}, function(err){
       if(err) {
           console.log(err);
       }
      else {
            // Seed DB with campgrounds
             data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }
                    else{
                       // //create comment for campground
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: "Homer Simpson"
                        }, function(err, comment){
                            if(err){
                                console.log("Comment error " + err);
                            }
                            else{
                                campground.comments.push(comment._id);
                                campground.save();
                            }
                        });
                    }
                });    
            });
       }
    }); 
    
    User.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            User.register(new User({username: "Hector"}), "abc123", function(err, user){
                if(err){
                    console.log("Failed to seed the user");
                }
                else{
                    console.log("User has been seeded");
                }
            });
        }
    });
};

module.exports = seedDB;
