using System.Collections.Generic;

namespace RosraApp.Models.ViewModels
{
    public class TabViewModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVisited { get; set; }
        public string ContentPartialName { get; set; } = string.Empty;
    }

    public class TabsContainerViewModel
    {
        public string ContainerId { get; set; } = string.Empty;
        public List<TabViewModel> Tabs { get; set; } = new List<TabViewModel>();
        public RosraFormViewModel TabContentModel { get; set; } = new RosraFormViewModel();
    }
}
