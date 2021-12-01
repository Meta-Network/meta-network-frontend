import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { StyledSliderLogo, StyledSliderLink, StyledSliderLinkText, StyledSliderLinkLogo } from './Style'
import MetaImage from '../../assets/images/meta.png'

interface Props {
  readonly visible: boolean
}

// 侧边栏 用户内容
const SliderLogo: React.FC<Props> = React.memo(function SliderLogo({ visible }) {
	return (
		<StyledSliderLogo visible={visible}>
			<Link href="/" passHref>
				<StyledSliderLink>
					<StyledSliderLinkLogo>
						<Image src={MetaImage} alt={'logo'} layout="fill" objectFit="contain" />
					</StyledSliderLinkLogo>
					{
						visible ? <StyledSliderLinkText>Meta Network</StyledSliderLinkText> : null
					}
				</StyledSliderLink>
			</Link>
		</StyledSliderLogo>
	)
})


export default SliderLogo