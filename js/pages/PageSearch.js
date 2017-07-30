const selectors = {
  CHANGE_LANGUAGE: '#header-wrapper > div.top-nav > nav > ul.right-menu > li:nth-child(3) > a',
  BUTTON_CRITERIAS: '#btn-advanced-criterias',
  BUTTON_COMMERCIAL: '#commercial',
  OPTION_MULTIFAMILY: '#item-property > button:nth-child(10)',
  OPTION_PLEX: '#item-property > button:nth-child(5)',
  BUTTON_SEARCH: '#search-form-bottom-actions button.btn.btn-search',
  SELECTOR_ORDER: '#selectSortById',
  SELECT_RECENT: '#selectSortById > div.dropdown.active > ul > li:nth-child(4)',
  BUTTON_NEXT_SUMMARY: '#divWrapperPager > ul > li.next',
  LABEL_PAGE_STATUS: '#divWrapperPager > ul > li.pager-current'
};

function searchForResidentialPlexes (){
  return browser.get('/en')
    .then(() => waitAndClick(selectors.BUTTON_CRITERIAS)) //open the criterias
    .then(() => waitAndClick(selectors.OPTION_PLEX)) // select only plexes
    .then(() => waitAndClick(selectors.BUTTON_SEARCH)) // search
    .then(() => waitAndClick(selectors.SELECTOR_ORDER)) // select order by more recent first
    .then(() => waitAndClick(selectors.SELECT_RECENT)) // order by the most recent first
};

function searchForCommercialPlexes(){
  return browser.get('/en')
    .then(() => waitAndClick(selectors.BUTTON_CRITERIAS)) // Open the criterias
    .then(() => waitAndClick(selectors.BUTTON_COMMERCIAL)) // Commercial.
    .then(() => waitAndClick(selectors.OPTION_MULTIFAMILY)) //select multi family.
    .then(() => waitAndClick(selectors.BUTTON_SEARCH))
    .then(() => waitAndClick(selectors.SELECTOR_ORDER)) // select order by more recent first
    .then(() => waitAndClick(selectors.SELECT_RECENT)) // order by the most recent first
};


module.exports = {
  searchForResidentialPlexes: searchForResidentialPlexes,
  searchForCommercialPlexes: searchForCommercialPlexes
}
