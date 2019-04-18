import React from 'react'
import { shallow } from 'enzyme'
import Button from './Button'

const defaultProps = {
  text: 'I am a button'
}

const create = (props = {}) => shallow(<Button {...defaultProps} {...props} />)

describe('Button', () => {
  it('should match snapshot', () => {
      const wrapper = create()
      expect(wrapper).toMatchSnapshot()
  })
  it('should call onClick when clicked', () => {
    const onClick = jest.fn()
    const wrapper = create({ onClick })

    wrapper.find('button').simulate('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
