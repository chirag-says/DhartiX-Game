import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import "./CommunityBoard.css";

const CommunityBoard = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "EcoWarrior",
      title: "Tips for water conservation",
      content:
        "I've reduced my water usage by 30% using drip irrigation and mulching. Here's how...",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      user: "GreenThumb",
      title: "Organic pest control methods",
      content:
        "Instead of chemical pesticides, try neem oil spray. It's effective and eco-friendly!",
      time: "5 hours ago",
      likes: 18,
      comments: 5,
    },
    {
      id: 3,
      user: "SustainableSam",
      title: "Co-op meeting this Saturday",
      content:
        "We'll be discussing the new equipment sharing program. All members are encouraged to attend.",
      time: "1 day ago",
      likes: 12,
      comments: 3,
    },
  ]);

  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleCreatePost = () => {
    if (newPost.title.trim() !== "" && newPost.content.trim() !== "") {
      const post = {
        id: posts.length + 1,
        user: "You",
        title: newPost.title,
        content: newPost.content,
        time: "Just now",
        likes: 0,
        comments: 0,
      };
      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "" });
    }
  };

  return (
    <Card className="community-board">
      <div className="card-header">
        <h2 className="card-title">Community Board</h2>
      </div>

      <div className="create-post">
        <h3 className="section-title">Create a Post</h3>
        <input
          type="text"
          placeholder="Post title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="post-title-input"
        />
        <textarea
          placeholder="What's on your mind?"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          rows={3}
          className="post-content-input"
        />
        <Button variant="primary" onClick={handleCreatePost}>
          Post
        </Button>
      </div>

      <div className="posts-list">
        <h3 className="section-title">Recent Posts</h3>
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="post-user">
                <span className="user-avatar">{post.user.charAt(0)}</span>
                <span className="user-name">{post.user}</span>
              </div>
              <span className="post-time">{post.time}</span>
            </div>

            <div className="post-content">
              <h4 className="post-title">{post.title}</h4>
              <p className="post-text">{post.content}</p>
            </div>

            <div className="post-actions">
              <Button
                variant="outline"
                size="small"
                onClick={() => handleLikePost(post.id)}
              >
                👍 {post.likes}
              </Button>
              <Button variant="outline" size="small">
                💬 {post.comments}
              </Button>
              <Button variant="outline" size="small">
                ↗️ Share
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CommunityBoard;
