import React from 'react'
import { Tooltip } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { StyledSliderToggle, StyledSliderBottomLink } from './Style'
import { FeedbackLink } from '../../common/config'

interface Props {
  readonly visible: boolean
}

const SliderFeedback: React.FC<Props> = React.memo(function SliderFeedback({
  visible
}) {

  return (
    <StyledSliderToggle visible={visible}>
      <Tooltip placement="right" title={'Feedback'}>
        <StyledSliderBottomLink
          href={ FeedbackLink }
          target="_blank"
          rel="noopener noreferrer">
          <MessageOutlined />
        </StyledSliderBottomLink>
      </Tooltip>
    </StyledSliderToggle>
  )
})

export default SliderFeedback