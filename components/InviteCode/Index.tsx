import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isBrowser, isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import Copy from '../Copy/Index'
import CustomModal from '../CustomModal/Index'
import { InvitationsMineState } from '../../typings/ucenter.d'
import CustomEmpty from '../CustomEmpty/Index'

interface Props {
  isModalVisible: boolean,
  setIsModalVisible: (value: boolean) => void
  inviteCodeData: InvitationsMineState[]
}

const DeploySite: React.FC<Props> = ({ isModalVisible, setIsModalVisible, inviteCodeData }) => {
	const { t } = useTranslation('common')

	// 使用过的放后面
	const inviteCodeDataList = useMemo(() => inviteCodeData.sort((a, b) => (Number(a.invitee_user_id) - Number(b.invitee_user_id))), [inviteCodeData])

	// 内容
	const Content: React.FC = () => {
		return (
			<section>
				<p>{t('invitation-code-introduction')}</p>
				{
					inviteCodeData.length ? <StyledItem>
						{
							inviteCodeDataList.map((i, idx) => (
								<StyledContentCopy key={idx}>
									<Copy text={i.signature} disabled={Number(i.invitee_user_id) > 0}></Copy>
								</StyledContentCopy>
							))
						}
					</StyledItem> : <CustomEmpty description={t('no-invitation-code')} />
				}
			</section>
		)
	}

	return (
		<CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} mode={isMobile ? 'half-code' : ''}>
			<StyledContent>
				<StyledContentHead>
					<StyledContentHeadTitle>{t('your-invitation-code')}</StyledContentHeadTitle>
				</StyledContentHead>
				<Content></Content>
			</StyledContent>
		</CustomModal>
	)
}

const StyledContent = styled.section`
  color: #fff;
`

const StyledContentHead = styled.section`
  text-align: center;
  margin-bottom: 32px;
`
const StyledContentHeadTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #C4C4C4;
`
const StyledContentCopy = styled.section`
  margin-top: 32px;
`
const StyledItem = styled.section`
  min-height: 70px;
  max-height: 280px;
  overflow: auto;
`

export default DeploySite