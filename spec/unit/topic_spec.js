const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

    beforeEach((done) => {
      this.topic;
      sequelize.sync({force: true}).then((res) => {
        Topic.create({
          title: "Best ramens in OC",
          description: "a list of best ramens you can find in OC"
        })
        .then((topic) => {
          this.topic = topic;
          Post.create({
            title: "J San Ramen",
            body: "I tried it and it's good, located in Irvine, CA",
            topicId: this.topic.id
          })
          .then((post) => {
            this.post = post;
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    describe('#create()', () => {
        it('should create a topic object with a title, description, and topic Id', (done) => {
            expect(this.topic.title).toContain("Best ramens in OC");
            expect(this.topic.description).toContain("a list of best ramens you can find in OC");
            done();
        })  
    })
    
    describe('#getPosts()', () => {
        it('should return all posts with the associated topic', (done) => {
            this.topic.getPosts()
            .then((associatedPosts) => {
                expect(associatedPosts[0].title).toBe("J San Ramen");
                expect(associatedPosts[0].body).toBe("I tried it and it's good, located in Irvine, CA");
                expect(associatedPosts[0].topicId).toBe(this.topic.id);
                done();
            })
        })
    })

});