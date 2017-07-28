'use strict';

module.exports = () => {

  const scrapeGridSchema = {
    id: {
      sel: 'div.description > a',
      attr: 'data-mlsnumber'
    },
    url :{
       sel : 'div.thumbnail > a',
       attr : 'href'
    },
    updated: {
      sel : 'div.banner.new-property',
      method : function($) {
        return $(this).length == 1;
      }
    }
  };

  return artoo.scrape('div.thumbnailItem', scrapeGridSchema);
};
