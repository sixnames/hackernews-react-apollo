import React, {useState} from "react";
import Link from "./LInks";
import gql from 'graphql-tag';
import {withApollo} from "react-apollo";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

function Search(props) {
  const [state, setState] = useState({
    links: [],
    filter: ''
  });
  
  const _executeSearch = async () => {
    const {filter} = state;
    const result = await props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: {filter},
    });
    const links = result.data.feed.links;
    setState({links})
  };
  
  return (
    <div>
      <div>
        Search
        <input
          type='text'
          onChange={({target: {value}}) => setState((prevState) => ({
            ...prevState,
            filter: value
          }))}
        />
        <button onClick={() => _executeSearch()}>OK</button>
      </div>
      {state.links.map((link, index) => (
        <Link key={link.id} link={link} index={index}/>
      ))}
    </div>
  );
}

export default withApollo(Search);