import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFiltersItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

class GithubPopularRepos extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    repositoryItem: [],
    activeLanguageFilteredId: languageFiltersData[0].id,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {activeLanguageFilteredId} = this.state

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilteredId}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const fetechedData = await response.json()
      const updatedRepositoryItem = fetechedData.popular_repos.map(
        eachData => ({
          name: eachData.name,
          id: eachData.id,
          issuesCount: eachData.issues_count,
          forksCount: eachData.forks_count,
          starsCount: eachData.stars_count,
          avatarUrl: eachData.avatar_url,
        }),
      )

      this.setState({
        repositoryItem: updatedRepositoryItem,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccess = () => {
    const {repositoryItem} = this.state
    return (
      <ul className="each-item">
        {repositoryItem.map(eachItem => (
          <RepositoryItem repositoryEachItem={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="item-failureImage"
        alt="failure-view"
      />
      <h1 className="failureItem-header">Something Went Wrong</h1>
    </div>
  )

  renderInProgress = () => (
    <div textid="loader">
      <Loader type="threeDots" color="#0284c7" width={80} height={80} />
    </div>
  )

  renderStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderInProgress()
      default:
        return null
    }
  }

  setActiveLanguageFilterId = newFilterID => {
    this.setState({activeLanguageFilteredId: newFilterID}, this.getProducts)
  }

  renderLanguageFilteredList = () => {
    const {activeLanguageFilteredId} = this.state

    return (
      <ul className="unordered-container">
        {languageFiltersData.map(eachData => (
          <LanguageFiltersItem
            languageData={eachData}
            key={eachData.id}
            isActive={eachData.id === activeLanguageFilteredId}
            setActiveLanguageFilterId={this.setActiveLanguageFilterId}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="github-container">
        <h1 className="github-header">Popular</h1>
        {this.renderLanguageFilteredList}
        {this.renderStatus}
      </div>
    )
  }
}

export default GithubPopularRepos
