import React, { FC } from 'react'
import { Container } from '@components/ui'
import s from './Hero.module.css'
import Link from 'next/link'
interface HeroProps {
  className?: string
  headline: any
  description: any
}

const Hero: FC<HeroProps> = ({ headline, description }) => {
  return (
    <div className="bg-accent-9 border-b border-t border-accent-2">
      <Container>
        <div className={s.root}>
          <h2 className={s.title}>{headline}</h2>
          <div className={s.description}>
            <p>{description}</p>
            <Link href="/">
              <a className="flex items-center text-accent-0 pt-3 font-bold hover:underline cursor-pointer w-max-content">
                Shop Now
              </a>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Hero
