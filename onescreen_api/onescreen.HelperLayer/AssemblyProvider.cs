﻿using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webdHelper
{
    internal class AssemblyProvider
    {
        private static AssemblyProvider _assemblyProvider = null;

        private string _providerName = string.Empty;
        public AssemblyProvider()
        {
            _providerName = Configuration.GetProviderName(Configuration.DefaultConnection);
        }

        public AssemblyProvider(string providerName)
        {
            _providerName = providerName;
        }


        #region Refactored Code
        internal DbProviderFactory Factory
        {
            get
            {
                DbProviderFactory factory = DbProviderFactories.GetFactory(_providerName);
                return factory;
            }
        }

        #endregion

        #region "Internal Methods and Properties"



        //public static AssemblyProvider GetInstance(string providerName)
        //{
        //    if (_assemblyProvider == null)
        //    {
        //        _assemblyProvider = new AssemblyProvider(providerName);
        //    }
        //    return _assemblyProvider;
        //}

        #endregion


    }
}
