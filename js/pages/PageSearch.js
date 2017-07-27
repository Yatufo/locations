'use strict';


const selectors = {
  CHANGE_LANGUAGE: '#header-wrapper > div.top-nav > nav > ul.right-menu > li:nth-child(3) > a',
  BUTTON_CRITERIAS: '#btn-advanced-criterias',
  OPTION_PLEX: '#item-property > button:nth-child(5)',
  BUTTON_SEARCH: '#search-form-bottom-actions button.btn.btn-search',
  SELECTOR_ORDER: '#selectSortById',
  SELECT_RECENT: '#selectSortById > div.dropdown.active > ul > li:nth-child(4)',
  BUTTON_SUMMARY_TAB: '#ButtonViewSummary',
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};


const searchForPlexes = () => {
   return browser.get('/en')
    .then(() => {
      //open the criterias
      waitAndClick(selectors.BUTTON_CRITERIAS);

      // select the criterias
      waitAndClick(selectors.OPTION_PLEX);

      // search
      waitAndClick(selectors.BUTTON_SEARCH);

      // select order by more recent first
      waitAndClick(selectors.SELECTOR_ORDER);

      // order by the most recent first
      return waitAndClick(selectors.SELECT_RECENT);

      // //Summary Tab button
      // return waitAndClick(selectors.BUTTON_SUMMARY_TAB);
    });
};

module.exports = {
  searchForPlexes: searchForPlexes
}
