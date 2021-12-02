import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Form, Input, Avatar, Popconfirm, Tag, Spin } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useDebounceFn } from 'ahooks'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import CustomModal from '../CustomModal/Index'
import { StoreSet, StoreGet, StoreRemove } from '../../utils/store'
import { SearchHistory, translateMapState } from '../../typings/node.d'
import { hexGridsByFilter } from '../../services/metaNetwork'
import { PointScopeState, hexGridsByFilterState } from '../../typings/metaNetwork.d'
import { assign, uniqBy, trim } from 'lodash'
import { compose } from '../../utils/index'
import CustomEmpty from '../CustomEmpty/Index'

interface Props {
  readonly isModalVisible: boolean,
  readonly defaultHexGridsRange: PointScopeState
  setIsModalVisible: (value: boolean) => void
  setVisibleSlider: (value: boolean) => void
  translateMap: (value: translateMapState) => void
}

/**
 * 搜索 Modal
 * @param param0
 * @returns
 */
const SearchModal: React.FC<Props> = ({ isModalVisible, defaultHexGridsRange, setIsModalVisible, setVisibleSlider, translateMap }) => {
	const { t } = useTranslation('common')
	const [form] = Form.useForm()
	// 是否显示历史记录内容
	const [showSearch, setShowSearch] = useState<boolean>(false)
	// 搜索历史
	const [searchHistoryList, setSearchHistoryList] = useState<SearchHistory[]>([])
	// 搜索结果
	const [searchList, setSearchList] = useState<hexGridsByFilterState[]>([])
	// 搜索
	const [loading, setLoading] = useState<boolean>(false)

	const KEY = 'MetaNetWorkSearchHistory'

	// init
	useEffect(() => {
		if (isModalVisible) {
			fetchHistory()
		} else {
			setSearchList([])
			setLoading(false)
			setShowSearch(false)
			form.resetFields()
		}
	}, [isModalVisible, form])

	const onFinish = (values: any) => {
		console.log('Success:', values)
	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}


	/**
   * 搜素 event
   * @param value
   */
	const handlePressEnter = (value: string) => {
		handleSearch(value)
	}
	// input changed
	const { run: handleSearchChanged } = useDebounceFn(
		(value: string) => {
			handleSearch(value)
		},
		{
			wait: 300,
		},
	)
	// tag
	const handleTagClick = (value: string) => {
		form.setFieldsValue({ searchValue: value })
		handleSearch(value)
	}
	useEffect(() => {
		console.log('form')
	}, [form])



	/**
   * 处理搜索
   * @param val
   * @returns
   */
	const handleSearch = (val: string) => {
		const value = trim(val) || ''
		if (!value) {
			setShowSearch(false)
			return
		}

		fetchSearch(value)
		mergedHistory(value)
		fetchHistory()
	}

	/**
   * 获取搜索内容
   */
	const fetchSearch = useCallback(
		async (value: string): Promise<void> => {
			setShowSearch(true)
			setLoading(true)
			try {
				const data = assign(defaultHexGridsRange, { simpleQuery: value })
				const res = await hexGridsByFilter(data)
				if (res.statusCode === 200) {
					setSearchList(res.data)
				} else {
					console.error(res.message)
				}
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}, [defaultHexGridsRange])

	/**
   * 合并历史记录
   * @param value
   */
	const mergedHistory = (value: string): void => {
		console.log('value', value)

		const searchHistoryJSON = StoreGet(KEY)
		const searchHistory: SearchHistory[] = searchHistoryJSON ? JSON.parse(searchHistoryJSON) : []
		searchHistory.push({
			value: value,
			lastTime: Date.now()
		})

		const list = uniqBy(searchHistory, 'value')

		if (list.length > 12) {
			list.shift()
		}

		StoreSet(KEY, JSON.stringify(list))
	}

	/**
   * 获取搜索历史
   */
	const fetchHistory = (): void => {
		const searchHistoryJSON = StoreGet(KEY)
		const searchHistory: SearchHistory[] = searchHistoryJSON ? JSON.parse(searchHistoryJSON) : []
		// 防止意外过滤一次
		const filterEmpty = (data: SearchHistory[]) => data.filter((i: SearchHistory) => !!i.value)
		const filterDuplication = (data: SearchHistory[]) => uniqBy(data, 'value')

		const list = compose(filterDuplication, filterEmpty)(searchHistory)
		setSearchHistoryList(list.reverse())
	}

	/**
   * 删除所有历史
   */
	const removeAllHistory = (): void => {
		StoreRemove(KEY)
		fetchHistory()
	}

	/**
   * 删除历史
   * @param history
   */
	const removeHistory = (e: any, history: SearchHistory): void => {
		e.preventDefault()

		const searchHistoryJSON = StoreGet(KEY)
		const searchHistory: SearchHistory[] = searchHistoryJSON ? JSON.parse(searchHistoryJSON) : []

		const idx = searchHistory.findIndex(i => i.value === history.value)
		if (~idx) {
			searchHistory.splice(idx, 1)
			StoreSet(KEY, JSON.stringify(searchHistory))

			fetchHistory()
		}
	}

	/**
   * 查看搜索记录
   * @param i
   */
	const handleViewNode = (i: hexGridsByFilterState) => {
		setIsModalVisible(false)
		setVisibleSlider(false)

		translateMap({ point: { x: i.x, y: i.y, z: i.z } })
	}

	return (
		<CustomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} mode={ isMobile ? 'full' : '' }>
			<StyledContent>
				<StyledContentHead>
					<StyledContentHeadTitle>{t('search')}</StyledContentHeadTitle>
				</StyledContentHead>
				<div>
					<Form
						form={form}
						name="search"
						initialValues={{ remember: true }}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
					>
						<Form.Item
							label=""
							name="searchValue"
							rules={[{ required: true, message: 'Please search!' }]}
						>
							<Input
								placeholder={t('search')}
								prefix={<SearchOutlined />}
								className="custom-search"
								maxLength={40}
								allowClear={true}
								onPressEnter={(e: any) => handlePressEnter(e.target.value)}
								onChange={(e: any) => handleSearchChanged(e.target.value)}
							/>
						</Form.Item>
					</Form>

					{
						showSearch ?
							<StyledContentItem>
								<StyledContentItemHead>
									<StyledContentItemHeadTitle>ID{t('layer')}</StyledContentItemHeadTitle>
								</StyledContentItemHead>
								<StyledItem >
									{
										searchList.map((i) => (
											<StyledItemLi key={i.userId}>
												<Avatar size={40} src={i.userAvatar} icon={<UserOutlined />} />
												<StyledItemLiUser>
													<h3>{i.userNickname || i.username || t('no-nickname')}</h3>
													<p>{i.userBio || t('no-introduction')}</p>
												</StyledItemLiUser>
												<StyledItemLiButton onClick={() => handleViewNode(i)}>{t('check')}</StyledItemLiButton>
											</StyledItemLi>
										))
									}
									{
										searchList.length <= 0 ? <CustomEmpty description={t('no-content')}></CustomEmpty> : null
									}
									{
										loading ? <StyledEmpty>
											<Spin></Spin>
										</StyledEmpty> : null
									}
								</StyledItem>
							</StyledContentItem> :
							<StyledContentItem>
								<StyledContentItemHead>
									<StyledContentItemHeadTitle>{t('search-history')}</StyledContentItemHeadTitle>
									{
										searchHistoryList.length <= 0 ? null :
											<Popconfirm placement="top" title={t('confirm-delete-history')} onConfirm={() => removeAllHistory()} okText="Yes" cancelText="No">
												<StyledContentItemHeadDelete>{t('delete')}</StyledContentItemHeadDelete>
											</Popconfirm>
									}
								</StyledContentItemHead>
								<StyledContentHiitory>
									{
										searchHistoryList.map((i, idx) => (
											<Tag closable onClose={(e: any) => removeHistory(e, i)} key={idx} className="custom-tag" onClick={() => handleTagClick(i.value)}>
												{i.value}
											</Tag>
										))
									}
									{
										searchHistoryList.length <= 0 ? <CustomEmpty description={t('no-content')}></CustomEmpty> : null
									}
								</StyledContentHiitory>
							</StyledContentItem>
					}
				</div>
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


const StyledItem = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 200px;
  max-height: 420px;
  overflow: auto;
`
const StyledItemLi = styled.li`
  display: flex;
  align-items: center;
  margin: 8px 0;
  padding: 10px 0;
`
const StyledItemLiUser = styled.section`
  max-width: 220px;
  margin-left: 12px;
  h3 {
    padding: 0;
    margin: 0 0 4px 0;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    text-align: left;
    color: #F5F5F5;
  }
  p {
    padding: 0;
    margin: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    color: #F5F5F5;
    opacity: 0.4;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`
const StyledItemLiButton = styled.button`
  margin-left: auto;
  border: 1.2px solid #fff;
  box-sizing: border-box;
  border-radius: 40px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  padding: 8px 10px;
  background-color: transparent;
  cursor: pointer;
`

const StyledContentItem = styled.section`
  margin-top: 32px;
`
const StyledContentItemHead = styled.section`
  padding: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: .6;
`
const StyledContentItemHeadTitle = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #C4C4C4;
  margin: 0;
`
const StyledContentItemHeadDelete = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #FF644F;
  margin: 0;
  cursor: pointer;
`

const StyledContentHiitory = styled.section`
  margin-top: 12px;
  & > span {
    margin-right: 16px;
    margin-bottom: 16px;
  }
`

const StyledEmpty = styled.section`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #C4C4C4;
  text-align: center;
  padding: 20px 0;
`

export default SearchModal