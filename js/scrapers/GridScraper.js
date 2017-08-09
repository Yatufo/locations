

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
    price: () => {
      return parseInt($('div.description p.price span:nth-child(2)').attr('content'));
    },
    updated: {
      sel : 'div.banner.new-property, div.banner.new-price',
      method : function($) {
        return $(this).length == 1;
      }
    }
  };

  return artoo.scrape('div.thumbnailItem', scrapeGridSchema);
};
