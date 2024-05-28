import axios from "axios"
import * as cheerio from 'cheerio'

const getExternalNews = async (url: string) => {
  try {
    const response = await axios.get(url)
    const html = response.data

    return html
  } catch (error: any) {
    throw new Error(`Error fetching external news: ${error.message}`);
  }
}

const checkDomain = (url?: string) => {
  if (!url) return
  const hostname = new URL(url).hostname
  return hostname.split('.').slice(-2).join('.')
}

const parseCNN = (html: any) => {
  const $ = cheerio.load(html)

  const attributes = ['[data-editable="description"]', '[data-editable="content"]']
  
  let description = '';
  
  attributes.some(attribute => {
    const element = $(attribute).first();
    if (element.length > 0) {
      description = element.text();
      return true;
    }
    return false;
  });
  const title = $('.video-resource__headline').first().text() || $('h1').first().text()
  
  const result = {
    title: title,
    description: description,
  }

  return result
}

export const parseNews = async (url: string) => {
  const domain = checkDomain(url)
  const html = await getExternalNews(url)

  switch (domain) {
    case 'cnn.com':
      return parseCNN(html)
    default:
      return null
  }
}
