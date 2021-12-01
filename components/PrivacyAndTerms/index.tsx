import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { LanguageProps } from '../../typings/i18n'

const markdownEn = `
# Privacy Policy

## What information do we collect?

    Basic account information: If you register on this server, you may be asked to enter a username, an e-mail address and a password. You may also enter additional profile information such as a display name and biography, and upload a profile picture and header image. The username, display name, biography, profile picture and header image are always listed publicly. Do not share any dangerous information over Meta Network.
    IPs and other metadata: When you log in, we record the IP address you log in from, as well as the name of your browser application. All the logged in sessions are available for your review and revocation in the settings. The latest IP address used is stored for up to 12 months. We also may retain server logs which include the IP address of every request to our server.

## What do we use your information for?

Any of the information we collect from you may be used in the following ways:

    To provide the core functionality of Meta Network. You can only interact with other people's content and post your own content when you are logged in. For example, you may follow other people to view their combined posts in your own personalized home timeline.
    To aid moderation of the community, for example comparing your IP address with other known ones to determine ban evasion or other violations.
    The email address you provide may be used to send you information, notifications about other people interacting with your content or sending you messages, and to respond to inquiries, and/or other requests or questions.

## How do we protect your information?

We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. Among other things, your browser session, as well as the traffic between your applications and the API, are secured with SSL, and your password is hashed using a strong one-way algorithm. You may enable two-factor authentication to further secure access to your account.
What is our data retention policy?

We will make a good faith effort to:

    Retain server logs containing the IP address of all requests to this server, in so far as such logs are kept, no more than 90 days.
    Retain the IP addresses associated with registered users no more than 12 months.

## Do we use cookies?

Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow). These cookies enable the site to recognize your browser and, if you have a registered account, associate it with your registered account.

We use cookies to understand and save your preferences for future visits.
Do we disclose any information to outside parties?

We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our site, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property, or safety.

Your public content may be downloaded by other servers in the network.

## Site usage by children

If this server is in the EU or the EEA: Our site, products and services are all directed to people who are at least 16 years old. If you are under the age of 16, per the requirements of the GDPR (General Data Protection Regulation) do not use this site.

If this server is in the USA: Our site, products and services are all directed to people who are at least 13 years old. If you are under the age of 13, per the requirements of COPPA (Children's Online Privacy Protection Act) do not use this site.

Law requirements can be different if this server is in another jurisdiction.

## Changes to our Privacy Policy

If we decide to change our privacy policy, we will post those changes on this page.

This document is CC-BY-SA. It was last updated Nov 16, 2021.

Originally adapted from the [Discourse privacy policy](https://github.com/discourse/discourse).
Meta Network
`

const markdownZh = `
# 隐私政策
## 我们收集什么信息？
基本帐户信息:如果你在此服务器上注册，可能会要求你输入用户名，电子邮件地址和密码。 你还可以输入其他个人资料信息，例如显示名称和传记，并上传个人资料照片和标题图像。 用户名，显示名称，传记，个人资料图片和标题图片始终公开列出。不要在 Meta Network 上分享任何危险信息。
IP和其他元数据: 登录时，我们会记录你登录的IP地址以及浏览器应用程序的名称。 所有登录的会话都可供你在设置中查看和撤销。 使用的最新IP地址最长可存储12个月。 我们还可以保留服务器日志，其中包括我们服务器的每个请求的IP地址。
我们将你的信息用于什么？
我们向你收集的任何信息均可通过以下方式使用：


你提供的电子邮件地址可能用于向你发送信息，有关其他人与你的内容交互或向你发送消息的通知，以及回复查询和/或其他请求或问题。
我们如何保护你的信息？
当你输入，提交或访问你的个人信息时，我们会实施各种安全措施以维护你的个人信息的安全。 除此之外，你的浏览器会话以及应用程序和API之间的流量都使用SSL进行保护，你的密码使用强大的单向算法进行哈希处理。 你可以启用双因素身份验证，以进一步保护对你帐户的访问。

## 我们的数据保留政策是什么？
我们真诚的努力：

保留包含此服务器的所有请求的IP地址的服务器日志，只要保留此类日志，不超过90天。
保留与注册用户关联的IP地址不超过12个月。


## 我们使用 cookies 吗？
是。 Cookie是网站或其服务提供商通过Web浏览器传输到计算机硬盘的小文件（如果允许）。 这些cookie使网站能够识别你的浏览器，如果你有注册帐户，则将其与你的注册帐户相关联。

我们使用Cookie来了解并保存你对未来访问的偏好。

我们是否透露任何信息给其他方？
我们不会将你的个人身份信息出售，交易或以其他方式转让给外方。 这不包括协助我们操作我们的网站，开展业务或为你服务的受信任的第三方，只要这些方同意保密这些信息。 当我们认为发布适合遵守法律，执行我们的网站政策或保护我们或他人的权利，财产或安全时，我们也可能会发布你的信息。

你的公共内容可能会被网络中的其他服务器下载。


## 儿童使用网站
如果此服务器位于欧盟或欧洲经济区：我们的网站，产品和服务都是针对至少16岁的人。 如果你未满16岁，则符合GDPR的要求(General Data Protection Regulation) 不要使用这个网站。

如果此服务器位于美国：我们的网站，产品和服务均面向至少13岁的人。 如果你未满13岁，则符合COPPA的要求 (Children's Online Privacy Protection Act) 不要使用这个网站。

如果此服务器位于另一个辖区，则法律要求可能不同。

## 我们隐私政策的变更
如果我们决定更改我们的隐私政策，我们会在此页面上发布这些更改。

本文件为CC-BY-SA。 它最后更新于2021年11月16日。
`

const PrivacyAndTerms = React.memo(function PrivacyAndTerms() {
	const router = useRouter()

	const doc = useMemo(() => {
		const list = {
			'en-US': markdownEn,
			'zh-CN': markdownZh,
		}
		return list[router.locale as LanguageProps] || list['en-US']
	}, [router.locale])

	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css" />
			</Head>
			<div className="markdown-body" style={{ maxWidth: 840, margin: '0 auto', padding: '40px 20px' }}>
				<ReactMarkdown>{doc}</ReactMarkdown>
			</div>
		</>
	)
})

export default PrivacyAndTerms