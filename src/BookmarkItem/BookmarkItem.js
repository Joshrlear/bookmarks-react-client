import React from 'react';

import Rating from '../Rating/Rating';
import config from '../config';
import BookmarkContext from '../BookmarksContext';
import PropTypes from 'prop-types';
import './BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'authorization': `bearer ${config.API_KEY}`
    }
  })
  .then(res => {
    if(!res.ok) {
      return res.json().then(error => {
        throw error
      })
    }
    return res.json()
  })
  .then(data => {
    cb(bookmarkId)
  })
  .catch(error => {
    console.error(error)
  })
}

export default function BookmarkItem(props) {
  return (
    <BookmarkContext.Consumer>
      {(context) => (
        <li className='BookmarkItem'>
          <div className='BookmarkItem__row'>
            <h3 className='BookmarkItem__title'>
              <a
                href={props.url}
                target='_blank'
                rel='noopener noreferrer'>
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className='BookmarkItem__description'>
            {props.description}
          </p>
          <div className='BookmarkItem__buttons'>
            <button
              className='BookmarkItem__description'
              onClick={() => {
                deleteBookmarkRequest(
                  props.id,
                  context.deleteBookmark,
                )
              }}
            >
              Delete
            </button>
          </div>
        </li>  
      )}
    </BookmarkContext.Consumer>
  )
}

BookmarkItem.defaultProps = {
  rating: 1,
  description: "",
  onClickDelete: () => {},
}

BookmarkItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: (props, propName, componentName) => {
    // get the value of the prop
    const prop = props[propName];

    // do the isRequired check
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation Failed`);
    }

    // check the type
    if (typeof prop != 'string') {
      return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
    }

    // do the custom check here
    // using a simple regex
    if (prop.length < 5 || !prop.match(new RegExp(/^https?:\/\//))) {
      return new Error(`Invalid prop, ${propName} must be min length 5 and begin http(s)://. Validation Failed.`);
    }
  },
  rating: PropTypes.number,
  description: PropTypes.string
};

Rating.propTypes = {
  value: (props, value, Rating) => {
    // first get the value of the prop
    const prop = props[value];

    // since we want to make this required let us check that first
    if(!prop) {
      return new Error(`${value} is required in ${Rating}. Validation Failed`);
    }

    // the prop has a value let's check the type
    if (typeof prop != 'number') {
      return new Error(`Invalid prop, ${value} is expected to be a number in ${Rating}. ${typeof prop} found.`);
    }

    // the prop is a number let us check the range
    if(prop < 1 || prop > 5) {
      return new Error(`Invalid prop, ${value} should be in range 1 - 5 in ${Rating}. ${prop} found.`);
    }

  }
};