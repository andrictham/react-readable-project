import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPostsRequest, getCategoriesRequest } from '../../actions'
import PostCategoryFilter from './components/PostCategoryFilter'
import PostSortToggle from './components/PostSortToggle'
import PostsList from './components/PostsList'
import { Flex } from 'rebass'

class AllPosts extends Component {
	state = {
		sortedBy: 'latest',
	}

	componentDidMount() {
		this.props.getPostsRequest()
		this.props.getCategoriesRequest()
	}

	toggleSortMethod = toggledTo => {
		if (this.state.sortedBy === 'latest' && toggledTo !== 'latest') {
			this.setState({ sortedBy: 'popular' })
		} else if (this.state.sortedBy === 'popular' && toggledTo !== 'popular') {
			this.setState({ sortedBy: 'latest' })
		}
	}

	onVote = direction => {
		console.log(`${direction} voted!`)
		// TODO: Fire off action to vote on the actual post
	}

	render() {
		const { posts, categories, match } = this.props

		// Filter posts by categoy, by looking at the route params
		// If nothing is passed in, assume we’re looking at all posts
		const filteredPosts = match.params.category
			? posts.filter(post => match.params.category === post.category)
			: posts

		const compare = (a, b) => {
			if (this.state.sortedBy === 'latest') {
				return b.timestamp - a.timestamp
			} else if (this.state.sortedBy === 'popular') {
				return b.voteScore - a.voteScore
			}
		}

		const sortedPosts = [].concat(filteredPosts.sort(compare))

		return (
			<Flex align="center" direction="column">
				<PostsViewControls>
					<PostCategoryFilter categories={categories} />
					<PostSortToggle
						sortedBy={this.state.sortedBy}
						onToggle={this.toggleSortMethod}
					/>
				</PostsViewControls>
				<PostsList posts={sortedPosts} onVote={this.onVote} />
			</Flex>
		)
	}
}

const PostsViewControls = styled.div`
	text-align: center;
	width: 100%;
`

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ getPostsRequest, getCategoriesRequest }, dispatch)
}

// const mapStateToProps = ({ posts }) => {
// 	const postsArray = Object.keys(posts).map(key => {
// 		return posts[key]
// 	})
// 	return { posts: postsArray }
// }

const mapStateToProps = ({ posts, categories }) => {
	const postsArray = Object.keys(posts).map(key => {
		return posts[key]
	})
	const categoriesArray = Object.keys(categories).map(key => {
		return categories[key]
	})
	return { posts: postsArray, categories: categoriesArray }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts)
