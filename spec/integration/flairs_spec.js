const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/topics';
const sequelize = require('../../src/db/models').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;

describe("routes : flairs", () => {

    beforeEach((done) => {
      this.topic;
      this.post;
      this.flair;
  
      sequelize.sync({force: true}).then((res) => {
  
        Topic.create({
          title: "Winter Games",
          description: "Post your Winter Games stories."
        })
        .then((topic) => {
          this.topic = topic;
  
          Post.create({
            title: "Snowball Fighting",
            body: "So much snow!",
            topicId: this.topic.id
          })
          .then((post) => {
            this.post = post;

        Flair.create({
            name: "chill",
            color: "blue",
            topicId: this.post.topicId,
            postId: this.post.id
          })
          .then((flair) => {
              this.flair = flair;
              done();
             })  
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
  
    });

    describe("GET /posts/:postId/flair/new", () => {

        it("should render a new flair form", (done) => {
          request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Flair");
            done();
          });
        });
    
      });

      describe('POST /posts/:postId/flair/create', () => {
		it('should create a new flair and redirect', done => {
			const options = {
				url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/create`,
				form: {
					name: "chill",
                    color: "blue",
                    postId: this.post.id,
                    topicId: this.post.topicId
				},
			};
			request.post(options, (err, res, body) => {
				Flair.findOne({ where: { name: "chill" } })
					.then((flair) => {
						expect(flair).not.toBeNull();
						expect(flair.name).toBe("chill");
						expect(flair.color).toBe("blue");
						expect(flair.postId).not.toBeNull();
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});
	});

  
  });