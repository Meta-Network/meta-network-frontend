import React, { useEffect, useState, useCallback } from 'react';
import { useCookieState, useInterval } from 'ahooks';
import { usersMe } from '../services/ucenter'
import { UsersMeProps } from '../typings/ucenter'

// interface Result {
//   user: UsersMeProps
//   setUser: () => void
// }

export const useUser = () => {
  // const [user, setUser] = useCookieState('user', {
  //   defaultValue: JSON.stringify({}),
  //   expires:  (() => new Date(+new Date() + 10 * 1000))(),
  // });

  const [user, setUser] = useState<UsersMeProps>({} as UsersMeProps)

  const userMeFn = useCallback(async() => {
    try {
      const res = await usersMe()
      if (res.statusCode === 200) {
        setUser(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }, [setUser])

  // useInterval(() => {
  //   userMeFn();
  // }, 3000);

  useEffect(() => {
    userMeFn()
  }, [])

  return {
    user, setUser
  }
}